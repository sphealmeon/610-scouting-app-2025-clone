"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { AggregateData } from "@/app/interfaces";
import { setCookie } from "@/app/cookies/cookies";
import { ArrowUpDown, ArrowUpIcon, ArrowDownIcon, Save, RefreshCw, Trash2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  loadPowerWeights, 
  savePowerWeights, 
  defaultPowerWeights,
  PowerWeights,
  PowerWeightsPreset,
  getPresets,
  savePreset,
  deletePreset,
  activatePreset
} from "@/app/firebase/powerWeights";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { nanoid } from "nanoid";

/**
 * Calculates a custom power rating based on the team's stats and configurable weights
 * @param team The team's aggregate data
 * @returns A power rating number
 */
const calculatePower = (team: AggregateData, weights: PowerWeights): number => {
  // Base calculation from weighted PPG components
  let power = 
    (team.autoPPG * weights.autoPPG) +
    (team.teleopPPG * weights.teleopPPG) +
    (team.endgamePPG * weights.endgamePPG);
  
  // Apply penalties for breaking
  power += team.brokePercentage * weights.brokePercentage;
  
  // Add bonuses for cycles
  power += team.coralCyclesScored * weights.coralCyclesScored;
  power += team.algaeCyclesScored * weights.algaeCyclesScored;
  
  return power;
};

/**
 * @param teamData an AggregateData array of all the teams data
 * @returns a sortable table showing important stats
 */
export default function ImportantTable({ teamData }: { teamData: AggregateData[] }) {
  const router = useRouter();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof typeof sortKeys;
    direction: 'asc' | 'desc';
  }>({ key: 'power', direction: 'desc' });
  
  const [powerWeights, setPowerWeights] = useState<PowerWeights>(defaultPowerWeights);
  const [isWeightsDialogOpen, setIsWeightsDialogOpen] = useState(false);
  const [tempWeights, setTempWeights] = useState<PowerWeights>(defaultPowerWeights);
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [presets, setPresets] = useState<PowerWeightsPreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("default");
  const [newPresetName, setNewPresetName] = useState<string>("");
  const [isCreatingPreset, setIsCreatingPreset] = useState<boolean>(false);

  // Load power weights from Firebase on component mount
  useEffect(() => {
    const fetchData = async () => {
      // Load active weights
      const weights = await loadPowerWeights();
      setPowerWeights(weights);
      setTempWeights(weights);
      
      // Load presets
      const loadedPresets = await getPresets();
      setPresets(loadedPresets);
      
      // Find which preset is active (if any)
      const activePreset = loadedPresets.find(
        p => JSON.stringify(p.weights) === JSON.stringify(weights)
      );
      if (activePreset) {
        setSelectedPresetId(activePreset.id);
      }
    };
    
    fetchData();
  }, []);

  // Calculate power for each team using the current weights
  const teamsWithPower = teamData.map(team => ({
    ...team,
    power: calculatePower(team, powerWeights)
  }));

  const sortKeys = {
    team: (data: AggregateData & { power: number }) => data.team,
    standing: (data: AggregateData & { power: number }) => data.standing,
    power: (data: AggregateData & { power: number }) => data.power,
    autoPPG: (data: AggregateData & { power: number }) => data.autoPPG,
    teleopPPG: (data: AggregateData & { power: number }) => data.teleopPPG,
    endgamePPG: (data: AggregateData & { power: number }) => data.endgamePPG,
    totalPPG: (data: AggregateData & { power: number }) => data.autoPPG + data.teleopPPG + data.endgamePPG,
    brokePercentage: (data: AggregateData & { power: number }) => data.brokePercentage,
  };

  const sortData = (key: keyof typeof sortKeys) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedData = [...teamsWithPower].sort((a, b) => {
    const getValue = sortKeys[sortConfig.key];
    const aValue = getValue(a);
    const bValue = getValue(b);
    return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
  });

  // Handle saving weights to Firebase
  const handleSaveWeights = async () => {
    setSaveStatus("Saving...");
    const success = await savePowerWeights(tempWeights);
    
    if (success) {
      setPowerWeights(tempWeights);
      setSaveStatus("Saved successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
      setIsWeightsDialogOpen(false);
    } else {
      setSaveStatus("Error saving weights");
    }
  };

  // Handle resetting weights to defaults
  const handleResetWeights = () => {
    setTempWeights(defaultPowerWeights);
  };

  const handlePresetSelect = async (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = presets.find(p => p.id === presetId);
    
    if (preset) {
      setTempWeights(preset.weights);
      
      // Activate the preset immediately
      const success = await activatePreset(preset);
      if (success) {
        setPowerWeights(preset.weights);
      }
    }
  };

  const handleSaveAsPreset = async () => {
    if (!newPresetName.trim()) {
      setSaveStatus("Please enter a preset name");
      return;
    }
    
    const newPreset: PowerWeightsPreset = {
      id: nanoid(),
      name: newPresetName.trim(),
      weights: tempWeights
    };
    
    const success = await savePreset(newPreset);
    
    if (success) {
      // Update presets list
      setPresets([...presets, newPreset]);
      setSelectedPresetId(newPreset.id);
      setNewPresetName("");
      setIsCreatingPreset(false);
      setSaveStatus("Preset saved successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } else {
      setSaveStatus("Error saving preset");
    }
  };

  const handleDeletePreset = async (presetId: string) => {
    // Don't allow deleting the default preset
    const preset = presets.find(p => p.id === presetId);
    if (preset?.isDefault) {
      setSaveStatus("Cannot delete the default preset");
      setTimeout(() => setSaveStatus(""), 3000);
      return;
    }
    
    const success = await deletePreset(presetId);
    
    if (success) {
      // Update presets list
      const updatedPresets = presets.filter(p => p.id !== presetId);
      setPresets(updatedPresets);
      
      // If the deleted preset was selected, switch to default
      if (selectedPresetId === presetId) {
        const defaultPreset = updatedPresets.find(p => p.isDefault);
        if (defaultPreset) {
          setSelectedPresetId(defaultPreset.id);
          setTempWeights(defaultPreset.weights);
        }
      }
      
      setSaveStatus("Preset deleted successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } else {
      setSaveStatus("Error deleting preset");
    }
  };

  return (
    <div className="rounded-md border border-gray-700 bg-[#121212]">
      <div className="flex justify-between items-center p-2 bg-gray-800">
        <h2 className="text-lg font-semibold">Team Power Rankings</h2>
        
        <Dialog open={isWeightsDialogOpen} onOpenChange={setIsWeightsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Configure Power Weights
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Power Rating Weights</DialogTitle>
            </DialogHeader>
            
            <div className="mb-4">
              <Label htmlFor="preset-select">Presets</Label>
              <div className="flex items-center gap-2 mt-1">
                <Select value={selectedPresetId} onValueChange={handlePresetSelect}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a preset" />
                  </SelectTrigger>
                  <SelectContent>
                    {presets.map(preset => (
                      <SelectItem key={preset.id} value={preset.id}>
                        {preset.name} {preset.isDefault && "(Default)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDeletePreset(selectedPresetId)}
                  disabled={presets.find(p => p.id === selectedPresetId)?.isDefault}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {isCreatingPreset ? (
              <div className="mb-4">
                <Label htmlFor="new-preset-name">New Preset Name</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="new-preset-name"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    placeholder="Enter preset name"
                  />
                  <Button onClick={handleSaveAsPreset}>Save</Button>
                  <Button variant="outline" onClick={() => setIsCreatingPreset(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                className="mb-4 flex items-center gap-2"
                onClick={() => setIsCreatingPreset(true)}
              >
                <PlusCircle className="h-4 w-4" />
                Save as New Preset
              </Button>
            )}
            
            <div className="grid gap-4 py-4">
              {Object.entries(tempWeights).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor={key} className="text-right capitalize">
                    {key === "brokePercentage" ? "Broke %" : 
                     key === "autoPPG" ? "Auto PPG" : 
                     key === "teleopPPG" ? "Teleop PPG" : 
                     key === "endgamePPG" ? "Endgame PPG" : 
                     key === "coralCyclesScored" ? "Coral Cycles" : 
                     key === "algaeCyclesScored" ? "Algae Cycles" : 
                     key}
                  </Label>
                  <Input
                    id={key}
                    type="number"
                    step="0.1"
                    value={value}
                    onChange={(e) => 
                      setTempWeights({
                        ...tempWeights,
                        [key]: parseFloat(e.target.value) || 0
                      })
                    }
                    className="col-span-2"
                  />
                </div>
              ))}
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleResetWeights}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reset to Defaults
              </Button>
              
              <Button 
                onClick={handleSaveWeights}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Apply Weights
              </Button>
            </div>
            
            {saveStatus && (
              <p className={`text-center mt-2 ${
                saveStatus.includes("Error") ? "text-red-500" : "text-green-500"
              }`}>
                {saveStatus}
              </p>
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            {Object.entries(sortKeys).map(([key, _]) => (
              <TableHead key={key} className="p-0">
                <Button 
                  className="bg-[#004d40] hover:bg-[#00695c] text-white w-full rounded-none h-full" 
                  onClick={() => sortData(key as keyof typeof sortKeys)}
                >
                  {key === 'totalPPG' ? 'Total PPG' : 
                   key === 'autoPPG' ? 'Auto PPG' : 
                   key === 'teleopPPG' ? 'Teleop PPG' : 
                   key === 'endgamePPG' ? 'Endgame PPG' : 
                   key === 'brokePercentage' ? 'Broke %' : 
                   key === 'power' ? 'Power Rating' :
                   key.charAt(0).toUpperCase() + key.slice(1)}
                  {sortConfig.key === key ? (
                    sortConfig.direction === 'asc' 
                      ? <ArrowUpIcon className="ml-2 h-4 w-4" />
                      : <ArrowDownIcon className="ml-2 h-4 w-4" />
                  ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((data) => (
            <TableRow 
              key={data.team}
              className="cursor-pointer hover:bg-gray-800 text-gray-200"
              onClick={() => {
                setCookie("Team", data.team.toString());
                window.open("/stats/teams", "_blank");
              }}
            >
              <TableCell className="font-medium">{data.team}</TableCell>
              <TableCell>{data.standing}</TableCell>
              <TableCell className="font-bold">{data.power.toFixed(1)}</TableCell>
              <TableCell>{data.autoPPG.toFixed(1)}</TableCell>
              <TableCell>{data.teleopPPG.toFixed(1)}</TableCell>
              <TableCell>{data.endgamePPG.toFixed(1)}</TableCell>
              <TableCell>{(data.autoPPG + data.teleopPPG + data.endgamePPG).toFixed(1)}</TableCell>
              <TableCell>{(data.brokePercentage * 100).toFixed(1)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
