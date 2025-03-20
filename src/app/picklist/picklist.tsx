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
import { collection, addDoc, getDocs, query, orderBy, setDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import { Picklist } from "@/app/interfaces";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Star, StarOff } from "lucide-react";

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
            <div className="flex items-center gap-2">
                <span className="text-gray-400 min-w-[24px]">{index + 1}.</span>
                <span>Team {team}</span>
            </div>
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
    const [doNotPickTeams, setDoNotPickTeams] = useState<string[]>([]);
    const [unavailableTeams, setUnavailableTeams] = useState<string[]>([]);
    const [watchlistTeams, setWatchlistTeams] = useState<string[]>([]);

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
            dnpTeams: doNotPickTeams,
            watchlist: watchlistTeams,
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
        setDoNotPickTeams(list.dnpTeams || []);
        setWatchlistTeams(list.watchlist || []);
        setShowSavedLists(false);
    };

    const handleTeamSelect = async (team: string) => {
        if (doNotPickTeams.includes(team)) {
            const newDoNotPick = doNotPickTeams.filter(t => t !== team);
            setDoNotPickTeams(newDoNotPick);
        }
        
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

    const addToPersonality = (team: string) => {
        if (selectedTeams.includes(team)) {
            setSelectedTeams(selectedTeams.filter(t => t !== team));
            if (selectedTeam === team) {
                setSelectedTeam(null);
                setMatchData([]);
            }
        } else if (unavailableTeams.includes(team)) {
            setUnavailableTeams(unavailableTeams.filter(t => t !== team));
        }
        
        if (!doNotPickTeams.includes(team)) {
            setDoNotPickTeams([...doNotPickTeams, team]);
        }
    };

    const moveTeamToUnavailable = (team: string) => {
        setSelectedTeams(selectedTeams.filter(t => t !== team));
        setUnavailableTeams([...unavailableTeams, team]);
    };

    const moveTeamToOrdered = (team: string) => {
        if (unavailableTeams.includes(team)) {
            setUnavailableTeams(unavailableTeams.filter(t => t !== team));
            setSelectedTeams([...selectedTeams, team]);
        } else if (doNotPickTeams.includes(team)) {
            setDoNotPickTeams(doNotPickTeams.filter(t => t !== team));
            setSelectedTeams([...selectedTeams, team]);
        }
    };

    const removeFromPersonality = (team: string) => {
        setDoNotPickTeams(doNotPickTeams.filter(t => t !== team));
    };

    const toggleWatchlist = (team: string) => {
        if (watchlistTeams.includes(team)) {
            setWatchlistTeams(watchlistTeams.filter(t => t !== team));
        } else {
            setWatchlistTeams([...watchlistTeams, team]);
        }
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
                                                <Button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteList(list.name);
                                                    }}
                                                    className="text-red-500 hover:text-red-400 px-2"
                                                >
                                                    x
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-1/5 min-w-[200px]">
                        <h2 className="text-2xl mb-4">Available Teams</h2>
                        <div className="overflow-y-auto max-h-[70vh]">
                            <ul className="space-y-2">
                                {teams
                                    .filter(team => !selectedTeams.includes(team) && !doNotPickTeams.includes(team) && !unavailableTeams.includes(team))
                                    .map((team) => (
                                        <li key={team} 
                                            className="flex items-center justify-between w-full p-3 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer"
                                        >
                                            <span onClick={() => handleTeamSelect(team)}>
                                                Team {team}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    onClick={() => toggleWatchlist(team)}
                                                    className="bg-clear hover:bg-gray-600 p-1"
                                                >
                                                    {watchlistTeams.includes(team) ? 
                                                        <Star className="h-4 w-4 text-yellow-400" /> : 
                                                        <StarOff className="h-4 w-4 text-gray-400" />
                                                    }
                                                </Button>
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addToPersonality(team);
                                                    }}
                                                    className="bg-clear text-gray-400 hover:text-gray-300 px-2"
                                                >
                                                    DNP
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>

                    <div className="w-1/5 min-w-[200px]">
                        <h2 className="text-2xl mb-4">Ordered Teams</h2>
                        <div className="overflow-y-auto max-h-[70vh]">
                            <ul className="space-y-2">
                                {selectedTeams.map((team, index) => (
                                    <li
                                        key={team}
                                        className="flex items-center justify-between w-full p-3 bg-gray-700 rounded"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 min-w-[24px]">{index + 1}.</span>
                                            <span>Team {team}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => toggleWatchlist(team)}
                                                className="bg-clear hover:bg-gray-600 p-1"
                                            >
                                                {watchlistTeams.includes(team) ? 
                                                    <Star className="h-4 w-4 text-yellow-400" /> : 
                                                    <StarOff className="h-4 w-4 text-gray-400" />
                                                }
                                            </Button>
                                            <Button 
                                                onClick={() => handleTeamRemove(team)}
                                                className="bg-clear text-red-500 hover:text-red-400 px-2"
                                            >
                                                x
                                            </Button>
                                            <Button 
                                                onClick={() => moveTeamToUnavailable(team)}
                                                className="bg-clear text-yellow-500 hover:text-yellow-400 px-2"
                                            >
                                                S-U
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="w-1/5 min-w-[200px]">
                        <h2 className="text-2xl mb-4">Selected - Unavailable</h2>
                        <div className="overflow-y-auto max-h-[70vh]">
                            <ul className="space-y-2">
                                {unavailableTeams.map((team, index) => (
                                    <li
                                        key={team}
                                        className="flex items-center justify-between w-full p-3 bg-red-900/50 rounded"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 min-w-[24px]">{index + 1}.</span>
                                            <span>Team {team}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => toggleWatchlist(team)}
                                                className="bg-clear hover:bg-gray-600 p-1"
                                            >
                                                {watchlistTeams.includes(team) ? 
                                                    <Star className="h-4 w-4 text-yellow-400" /> : 
                                                    <StarOff className="h-4 w-4 text-gray-400" />
                                                }
                                            </Button>
                                            <Button 
                                                onClick={() => moveTeamToOrdered(team)}
                                                className="bg-clear text-red-500 hover:text-red-400 px-2"
                                            >
                                                x
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="w-1/5 min-w-[200px]">
                        <h2 className="text-2xl mb-4">Personality</h2>
                        <div className="overflow-y-auto max-h-[70vh]">
                            <ul className="space-y-2">
                                {doNotPickTeams.map((team, index) => (
                                    <li
                                        key={team}
                                        className="flex items-center justify-between w-full p-3 bg-red-900/50 rounded"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 min-w-[24px]">{index + 1}.</span>
                                            <span>Team {team}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => toggleWatchlist(team)}
                                                className="bg-clear hover:bg-gray-600 p-1"
                                            >
                                                {watchlistTeams.includes(team) ? 
                                                    <Star className="h-4 w-4 text-yellow-400" /> : 
                                                    <StarOff className="h-4 w-4 text-gray-400" />
                                                }
                                            </Button>
                                            <Button 
                                                onClick={() => removeFromPersonality(team)}
                                                className="bg-clear text-red-500 hover:text-red-400 px-2"
                                            >
                                                x
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="w-1/3 min-w-[300px]">
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