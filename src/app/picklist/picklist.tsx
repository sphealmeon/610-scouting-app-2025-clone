"use client";

import { useState, useEffect } from "react";
import { teams } from "@/app/globalVars";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DataTable } from "../stats/teams/teamtable";
import { MatchTable } from "../stats/teams/matchtable";
import { StartPos } from "../stats/teams/startpos";
import { TeamMatchesData } from "@/app/firebase/teamMatchesData";
import { db } from "@/app/firebase/firebase";
import { collection, addDoc, getDocs, query, orderBy, setDoc, doc, deleteDoc } from "firebase/firestore";
import { Picklist } from "@/app/interfaces";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ItemTypes = {
    TEAM: 'team'
};

const DraggableTeam = ({ team, index, moveTeam, onRemove, onSelect }: { 
    team: string, 
    index: number, 
    moveTeam: (dragIndex: number, hoverIndex: number) => void,
    onRemove: () => void,
    onSelect: () => void 
}) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.TEAM,
        item: { team, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: ItemTypes.TEAM,
        hover: (item: { index: number }) => {
            if (item.index !== index) {
                moveTeam(item.index, index);
                item.index = index;
            }
        },
    });

    const dragDropRef = (element: HTMLLIElement | null) => {
        drag(element);
        drop(element);
    };

    return (
        <li
            ref={dragDropRef}
            className={`flex items-center justify-between w-64 p-2 bg-gray-700 rounded cursor-move ${
                isDragging ? 'opacity-50' : ''
            }`}
            onClick={onSelect}
        >
            <span>Team {team}</span>
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
                className="text-red-500 hover:text-red-400 px-2"
            >
                ×
            </button>
        </li>
    );
};

const PicklistPage = () => {
    const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
    const [matchData, setMatchData] = useState<any[]>([]);
    const [savedLists, setSavedLists] = useState<Picklist[]>([]);
    const [listName, setListName] = useState("");
    const [showSavedLists, setShowSavedLists] = useState(false);

    useEffect(() => {
        fetchSavedLists();
    }, []);

    const fetchSavedLists = async () => {
        const q = query(collection(db, "picklists"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const lists: Picklist[] = [];
        querySnapshot.forEach((doc) => {
            lists.push({ id: doc.id, ...doc.data() } as Picklist);
        });
        setSavedLists(lists);
    };

    const saveList = async () => {
        if (!listName) return;
        
        const newList: Picklist = {
            name: listName,
            teams: selectedTeams,
            createdAt: Date.now()
        };

        const docRef = doc(db, "picklists", listName);
        await setDoc(docRef, newList);
        
        setListName("");
        fetchSavedLists();
    };

    const deleteList = async (listName: string) => {
        const docRef = doc(db, "picklists", listName);
        await deleteDoc(docRef);
        fetchSavedLists();
    };

    const loadList = (list: Picklist) => {
        setSelectedTeams(list.teams);
        setShowSavedLists(false);
    };

    const handleTeamSelect = async (team: string) => {
        if (!selectedTeams.includes(team)) {
            setSelectedTeams([...selectedTeams, team]);
        }
        setSelectedTeam(team);
        if (team) {
            const matches = await TeamMatchesData({ team: parseInt(team) });
            const validMatches = matches.filter(match => 
                match !== undefined && 
                match.start?.match !== undefined && 
                match.start.match !== 0
            );
            setMatchData(validMatches);
        }
    };

    const handleTeamRemove = (teamToRemove: string) => {
        setSelectedTeams(selectedTeams.filter(team => team !== teamToRemove));
        if (selectedTeam === teamToRemove) {
            setSelectedTeam(null);
            setMatchData([]);
        }
    };

    const moveTeam = (dragIndex: number, hoverIndex: number) => {
        const newTeams = [...selectedTeams];
        const draggedTeam = newTeams[dragIndex];
        newTeams.splice(dragIndex, 1);
        newTeams.splice(hoverIndex, 0, draggedTeam);
        setSelectedTeams(newTeams);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col p-4 min-h-screen text-white">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-center">Team Picklist</h1>
                    <div className="flex gap-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">Save List</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Save Picklist</DialogTitle>
                                </DialogHeader>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="List Name"
                                        value={listName}
                                        onChange={(e) => setListName(e.target.value)}
                                    />
                                    <Button onClick={saveList}>Save</Button>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={showSavedLists} onOpenChange={setShowSavedLists}>
                            <DialogTrigger asChild>
                                <Button variant="outline">Load List</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Saved Picklists</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-2">
                                    {savedLists.map((list) => (
                                        <div 
                                            key={list.name}
                                            className="flex justify-between items-center p-2 bg-gray-700 rounded hover:bg-gray-600"
                                        >
                                            <span 
                                                className="flex-grow cursor-pointer"
                                                onClick={() => loadList(list)}
                                            >
                                                {list.name}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-400">
                                                    {list.teams.length} teams
                                                </span>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteList(list.name);
                                                    }}
                                                    className="text-red-500 hover:text-red-400 px-2"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div className="flex gap-8">
                    <div className="w-1/4">
                        <h2 className="text-2xl mb-4">Available Teams</h2>
                        <div className="overflow-y-auto max-h-[70vh]">
                            <ul className="space-y-2">
                                {teams
                                    .filter(team => !selectedTeams.includes(team))
                                    .map((team) => (
                                        <li key={team} 
                                            onClick={() => handleTeamSelect(team)}
                                            className="flex items-center w-full p-3 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer"
                                        >
                                            Team {team}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>

                    <div className="w-1/4">
                        <h2 className="text-2xl mb-4">Selected Teams</h2>
                        <div className="overflow-y-auto max-h-[70vh]">
                            <ul className="space-y-2">
                                {selectedTeams.map((team, index) => (
                                    <DraggableTeam 
                                        key={team} 
                                        team={team} 
                                        index={index} 
                                        moveTeam={moveTeam}
                                        onRemove={() => handleTeamRemove(team)}
                                        onSelect={() => handleTeamSelect(team)}
                                    />
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="w-2/4">
                        <h2 className="text-2xl mb-4">Team Stats - {selectedTeam}</h2>
                        <div className="overflow-y-auto max-h-[70vh]">
                            {selectedTeam ? (
                                <div className="space-y-4">
                                    <DataTable teams={[parseInt(selectedTeam)]} />
                                    <MatchTable team={parseInt(selectedTeam)} />
                                    <StartPos matches={matchData} />
                                </div>
                            ) : (
                                <p className="text-gray-400">Select a team to see stats</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

export default PicklistPage;