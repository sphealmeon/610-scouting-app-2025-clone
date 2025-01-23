"use client";


import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";


export default function Matchpoints({setMatchState}: {setMatchState: Function}) {
   const [Coral, setCoral] = useState(0);
   const [Algae, setAlgae] = useState(0);
   const [Fcoral, setFcoral] = useState(0);
   const [Palgae, setPalgae] = useState(0);
   const [Rcoral, setRcoral] = useState(0);
   const [Ralgae, setRalgae] = useState(0);
   const [Balgae, setBalgae] = useState(0);
   const [Submit, setSubmit] = useState(false);
   const [checked, setChecked] = useState(false);

   function handleProcessorClick(){
    setPalgae(Palgae + 1);
    setAlgae(Algae + 1);
}

function handleRobotShotClick(){
    setAlgae(Algae + 1);
    setBalgae(Balgae + 1);
}

function handleFloorPickupClick(){
    setCoral(Coral + 1);
    setFcoral(Fcoral + 1);
}

function handleRemoveallAlgaeClick(){
    setAlgae(0);
    setPalgae(0);
    setBalgae(0);
}

function handleRemoveallCoralClick(){
    setCoral(0);
    setFcoral(0);
}

   const handleSubmit = () => {
    setSubmit(!Submit)
    setMatchState(0);
  };


   return (
       <div className="flex flex-col items-center p-6 space-y-6 bg-gray-15 h-screen">
           {/* <h1 className="text-7xl font-bold text-gray-10000">Match review</h1> */}
            <div className="grid grid-cols-2 gap-6"> 
                <div>
                <p className="text-2xl space-y-6">
                    Coral Scored: <span className="text-3xl font-semibold text-blue-500">{Coral}</span>
                    Algae Scored: <span className="text-3xl font-semibold text-blue-500">{Algae}</span>
                </p>
                <div className="text-2xl gap-6">
                    Floor Pickup Coral Scored: <span className="text-3xl font-semibold text-blue-500">{Fcoral}</span>
                    Processor Scored: <span className="text-3xl font-semibold text-blue-500">{Palgae}</span>
                </div>
                <div className="text-2xl gap-6">
                Algae Scored in Barge: <span className="text-3xl font-semibold text-blue-500">{Balgae}</span>
                </div>
                </div>
                <div>
                <div className="text-2xl flex flex-col items-start space-y-4">
                    <label className="flex items-center space-x-2">
                        <input type="checkbox"
                        className= "w-10 h-10"
                        />
                            <span>Deep Cage</span>
                    </label>


                    <label className="text-2xl flex items-center space-x-2">
                    <input type="checkbox"
                    className= "w-10 h-10"
                    /> 
                        <span>Shallow Cage</span>
                    </label>


                    <label className="text-2xl flex items-center space-x-2">
                    <input type="checkbox"
                    className= "w-10 h-10"
                    />
                        <span>Park</span>
                    </label>
                </div>
            </div>
            </div>
            
           <div className="grid grid-cols-4 gap-2"> 
           {/* can fix this formatting later */}

           <Button
               onClick={handleFloorPickupClick}
               className="w-64 h-24 text-4xl bg-green-800 text-white rounded">
               Floor Pickup
           </Button>

           <Button
               onClick={handleProcessorClick}
               className="w-64 h-24 text-4xl bg-green-800 text-white rounded">
               Processor
           </Button>

           <Button
               onClick={() => setAlgae(Algae + 1)}
               className="w-64 h-24 text-4xl bg-green-800 text-white rounded">
               Add Algae
           </Button>

           <Button
               onClick={() => setCoral(Coral + 1)}
               className="w-64 h-24 text-4xl bg-green-800 text-white rounded">
               Add Coral 
           </Button>

           <Button
               onClick={handleRobotShotClick}
               className="w-64 h-24 text-4xl bg-green-800 text-white rounded">
               Robot Shot
           </Button>

           <Button
               onClick={handleRemoveallCoralClick}
               className="w-64 h-24 text-4xl bg-red-800 text-white rounded">
               Remove all Coral
           </Button>

           <Button
               onClick={handleRemoveallAlgaeClick}
               className="w-64 h-24 text-4xl bg-red-800 text-white rounded">
               Remove all Algae
           </Button>
           
           </div>

           <div className="text-2xl flex flex-col items-start space-y-6">
            <Button
                onClick={() => handleSubmit()}
                className="w-64 h-24 text-4xl bg-green-800 text-white rounded"
            >
                Submit
            </Button>
            </div>
       </div>
   );
}
