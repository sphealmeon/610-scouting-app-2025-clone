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

const DraggableTeam = ({ 
    team, 
    index, 
    moveTeam, 
    onRemove, 
    onSelect,
    onMoveToUnavailable,
    isWatchlisted,
    onToggleWatchlist
}: { 
    team: string, 
    index: number, 
    moveTeam: (dragIndex: number, hoverIndex: number) => void,
    onRemove: () => void,
    onSelect: () => void,
    onMoveToUnavailable: () => void,
    isWatchlisted: boolean,
    onToggleWatchlist: () => void
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
            className={`flex items-center justify-between w-full p-3 bg-gray-700 rounded cursor-move ${
                isDragging ? 'opacity-50' : ''
            }`}
            onClick={onSelect}
        >
            <div className="flex items-center gap-2">
                <span className="text-gray-400 min-w-[24px]">{index + 1}.</span>
                <span>Team {team}</span>
            </div>
            <div className="flex gap-2">
                <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist();
                    }}
                    className="bg-clear hover:bg-gray-600 p-1"
                >
                    {isWatchlisted ? 
                        <Star className="h-4 w-4 text-yellow-400" /> : 
                        <StarOff className="h-4 w-4 text-gray-400" />
                    }
                </Button>
                <Button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="bg-clear text-red-500 hover:text-red-400 px-2"
                >
                    x
                </Button>
                <Button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onMoveToUnavailable();
                    }}
                    className="bg-clear text-yellow-500 hover:text-yellow-400 px-2"
                >
                    S-U
                </Button>
            </div>
        </li>
    );
};

// Generic DraggableList component with fixed type for rightButton
const DraggableList = ({ 
    items, 
    itemType, 
    moveItem, 
    onItemRemove, 
    onItemSelect, 
    isItemWatchlisted,
    onToggleWatchlist,
    bgClass = "bg-gray-700", 
    rightButton
}: { 
    items: string[], 
    itemType: string,
    moveItem: (fromIndex: number, toIndex: number) => void,
    onItemRemove: (item: string) => void,
    onItemSelect: (item: string) => void,
    isItemWatchlisted: (item: string) => boolean,
    onToggleWatchlist: (item: string) => void,
    bgClass?: string,
    rightButton?: ((item: string, index: number) => React.ReactNode) | undefined
}) => {
    return (
        <ul className="space-y-2">
            {items.map((item, index) => (
                <DraggableItem
                    key={item}
                    item={item}
                    index={index}
                    itemType={itemType}
                    moveItem={moveItem}
                    onRemove={() => onItemRemove(item)}
                    onSelect={() => onItemSelect(item)}
                    isWatchlisted={isItemWatchlisted(item)}
                    onToggleWatchlist={() => onToggleWatchlist(item)}
                    bgClass={bgClass}
                    rightButton={rightButton ? rightButton(item, index) : null}
                />
            ))}
        </ul>
    );
};

// Generic DraggableItem component
const DraggableItem = ({ 
    item, 
    index, 
    itemType,
    moveItem, 
    onRemove, 
    onSelect,
    isWatchlisted,
    onToggleWatchlist,
    bgClass,
    rightButton
}: { 
    item: string, 
    index: number,
    itemType: string,
    moveItem: (fromIndex: number, toIndex: number) => void,
    onRemove: () => void,
    onSelect: () => void,
    isWatchlisted: boolean,
    onToggleWatchlist: () => void,
    bgClass: string,
    rightButton: React.ReactNode | null
}) => {
    const [{ isDragging }, drag] = useDrag({
        type: itemType,
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: itemType,
        hover: (draggedItem: { index: number }) => {
            if (draggedItem.index !== index) {
                moveItem(draggedItem.index, index);
                draggedItem.index = index;
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
            className={`flex items-center justify-between w-full p-3 ${bgClass} rounded cursor-move ${
                isDragging ? 'opacity-50' : ''
            }`}
            onClick={onSelect}
        >
            <div className="flex items-center gap-2">
                <span className="text-gray-400 min-w-[24px]">{index + 1}.</span>
                <span>Team {item}</span>
            </div>
            <div className="flex gap-2">
                <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist();
                    }}
                    className="bg-clear hover:bg-gray-600 p-1"
                >
                    {isWatchlisted ? 
                        <Star className="h-4 w-4 text-yellow-400" /> : 
                        <StarOff className="h-4 w-4 text-gray-400" />
                    }
                </Button>
                <Button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="bg-clear text-red-500 hover:text-red-400 px-2"
                >
                    x
                </Button>
                {rightButton}
            </div>
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
    const [watchlistNotes, setWatchlistNotes] = useState<Record<string, string>>({});
    const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
    const [currentTeamForNote, setCurrentTeamForNote] = useState<string | null>(null);
    const [noteText, setNoteText] = useState("");

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
            watchlistNotes: watchlistNotes,
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
        setWatchlistNotes(list.watchlistNotes || {});
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
            
            const updatedNotes = { ...watchlistNotes };
            delete updatedNotes[team];
            setWatchlistNotes(updatedNotes);
        } else {
            setCurrentTeamForNote(team);
            setNoteText(watchlistNotes[team] || "");
            setIsNoteDialogOpen(true);
        }
    };

    const handleNoteSubmit = () => {
        if (currentTeamForNote) {
            setWatchlistTeams([...watchlistTeams, currentTeamForNote]);
            
            setWatchlistNotes({
                ...watchlistNotes,
                [currentTeamForNote]: noteText
            });
            
            setIsNoteDialogOpen(false);
            setCurrentTeamForNote(null);
            setNoteText("");
        }
    };

    const handleNoteCancel = () => {
        setIsNoteDialogOpen(false);
        setCurrentTeamForNote(null);
        setNoteText("");
    };

    const updateWatchlistNote = (team: string, note: string) => {
        setWatchlistNotes({
            ...watchlistNotes,
            [team]: note
        });
    };

    // Add new moveItem functions for each list
    const moveUnavailableTeam = (dragIndex: number, hoverIndex: number) => {
        const newTeams = [...unavailableTeams];
        const draggedTeam = newTeams[dragIndex];
        newTeams.splice(dragIndex, 1);
        newTeams.splice(hoverIndex, 0, draggedTeam);
        setUnavailableTeams(newTeams);
    };
    
    const moveDoNotPickTeam = (dragIndex: number, hoverIndex: number) => {
        const newTeams = [...doNotPickTeams];
        const draggedTeam = newTeams[dragIndex];
        newTeams.splice(dragIndex, 1);
        newTeams.splice(hoverIndex, 0, draggedTeam);
        setDoNotPickTeams(newTeams);
    };
    
    // Function to select a team and load its data
    const selectTeam = (team: string) => {
        setSelectedTeam(team);
        TeamMatchesData({ team: parseInt(team) }).then(matches => {
            const validMatches = matches.filter(match => 
                match !== undefined && 
                match.start?.match !== undefined && 
                match.start.match !== 0
            );
            setMatchData(validMatches);
        });
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
                            <DraggableList
                                items={selectedTeams}
                                itemType="ordered-team"
                                moveItem={moveTeam}
                                onItemRemove={handleTeamRemove}
                                onItemSelect={selectTeam}
                                isItemWatchlisted={(team) => watchlistTeams.includes(team)}
                                onToggleWatchlist={toggleWatchlist}
                                rightButton={(team) => (
                                    <Button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            moveTeamToUnavailable(team);
                                        }}
                                        className="bg-clear text-yellow-500 hover:text-yellow-400 px-2"
                                    >
                                        S-U
                                    </Button>
                                )}
                            />
                        </div>
                    </div>

                    <div className="w-1/5 min-w-[200px]">
                        <h2 className="text-2xl mb-4">Selected - Unavailable</h2>
                        <div className="overflow-y-auto max-h-[70vh]">
                            <DraggableList
                                items={unavailableTeams}
                                itemType="unavailable-team"
                                moveItem={moveUnavailableTeam}
                                onItemRemove={moveTeamToOrdered}
                                onItemSelect={selectTeam}
                                isItemWatchlisted={(team) => watchlistTeams.includes(team)}
                                onToggleWatchlist={toggleWatchlist}
                                bgClass="bg-red-900/50"
                            />
                        </div>
                    </div>

                    <div className="w-1/5 min-w-[200px]">
                        <h2 className="text-2xl mb-4">Personality</h2>
                        <div className="overflow-y-auto max-h-[70vh]">
                            <DraggableList
                                items={doNotPickTeams}
                                itemType="dnp-team"
                                moveItem={moveDoNotPickTeam}
                                onItemRemove={removeFromPersonality}
                                onItemSelect={selectTeam}
                                isItemWatchlisted={(team) => watchlistTeams.includes(team)}
                                onToggleWatchlist={toggleWatchlist}
                                bgClass="bg-red-900/50"
                            />
                        </div>
                    </div>

                    <div className="w-1/3 min-w-[300px]">
                        <h2 className="text-2xl mb-4">Team Stats - {selectedTeam}</h2>
                        <div className="overflow-y-auto max-h-[70vh]">
                            {selectedTeam ? (
                                <div className="space-y-4">
                                    {watchlistTeams.includes(selectedTeam) && (
                                        <div className="border border-yellow-500/50 rounded p-4 bg-gray-800/50">
                                            <h3 className="text-lg font-semibold flex items-center mb-2">
                                                <Star className="h-5 w-5 text-yellow-400 mr-2" />
                                                Watchlist Notes
                                            </h3>
                                            <textarea
                                                className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 h-24"
                                                value={watchlistNotes[selectedTeam] || ""}
                                                onChange={(e) => updateWatchlistNote(selectedTeam, e.target.value)}
                                                placeholder="Enter notes about this team..."
                                            />
                                        </div>
                                    )}
                                    
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

                <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Watchlist Note for Team {currentTeamForNote}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <textarea
                                className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 h-32"
                                placeholder="Enter notes about this team..."
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={handleNoteCancel}>
                                    Cancel
                                </Button>
                                <Button onClick={handleNoteSubmit}>
                                    Save Note
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </DndProvider>
    );
};

export default PicklistPage;