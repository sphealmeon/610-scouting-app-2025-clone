export default function RobotPosition(){
    const handleClick = (position: string) => {
        alert(`You clicked ${position}`);
    };
    return(
        <div className="flex flex-col justify-center items-start h-[90vh] ml-4 my-4">
            <div
                className="flex-1 bg-gray-300 text-black flex justify-center items-center cursor-pointer hover:bg-gray-400 active:opacity-60 transition-colors border-2 border-black w-2/3"
                onClick={() => handleClick('Far')}
            >
                Far
            </div>
            <div
                className="flex-1 bg-gray-300 text-black flex justify-center items-center cursor-pointer hover:bg-gray-400 active:opacity-60 transition-colors border-2 border-black w-2/3"
                onClick={() => handleClick('Middle')}
            >
                Middle
            </div>
            <div
                className="flex-1 bg-gray-300 text-black flex justify-center items-center cursor-pointer hover:bg-gray-400 active:opacity-60 transition-colors border-2 border-black w-2/3"
                onClick={() => handleClick('Close')}
            >
                Close
            </div>
        </div>
    );
}