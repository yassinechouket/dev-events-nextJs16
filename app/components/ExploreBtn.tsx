'use client';

import Image from "next/image";
const Button=(props: React.ComponentPropsWithoutRef<'button'>)=>{
    return <button {...props}/>;
}

const ExploreBtn = () => {
    return (
        <a href="#events" className="block w-fit mx-auto mt-7">
            <Button
                type="button"
                id="explore-btn"
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 text-white font-bold shadow-lg transition-all duration-200 hover:scale-105 hover:from-teal-300 hover:to-blue-400 focus:outline-none focus:ring-4 focus:ring-cyan-200"
                onClick={() => console.log('CLICK')}
            >
                Explore Events
            </Button>
        </a>
    );
}

export default ExploreBtn;