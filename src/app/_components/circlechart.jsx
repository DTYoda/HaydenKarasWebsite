'use client'

import { useState, useEffect } from "react"

export default function CircleChart({skills, handleClick, sectorValue, currentCategory}) {

    
    let angle = (360 / skills.length);
    let [newAngle, setAngle] = useState(180 - angle / 2);

    useEffect(() => {
        angle = (360 / skills.length);
        setAngle((180 - angle / 2));
    }, [currentCategory]);
    

    const styles= {
        "transform": "rotate(" + newAngle + "deg)"
    };

    return (<div className={"wrapper transition-all w-[100%] h-[100%]"} style={styles}>
        {skills.map((skill, num) => (
            <div key={num} style={{"transform": "rotate(" +  angle * num + "deg) skew("+ (90 - angle) +  "deg)"}} className={"sector hover:bg-orange-400" + (sectorValue == num ? " bg-orange-500" : "")} onClick={() => {
                let diff = (sectorValue - num);
                if(Math.abs(diff) > skills.length / 2)
                {
                    diff = Math.sign(diff) == 1 ? -skills.length + diff : skills.length + diff;
                }

                setAngle((val) => (val + angle * diff));

                handleClick(skill);

            }}>
                <div className="select-none sm:text-[2vw] text-[3vw] h-[21vw] w-[21vw] flex justify-center items-center sm:h-[10vw] sm:w-[10vw] absolute bottom-0 right-0 text-white" style={{"transform": "rotate(" + (0) + "deg) skew(" + (angle - 90) + "deg)"}}><p style={{"transform": "rotate(" + (180 + angle / 2) + "deg)"}} >{skill}</p></div>
            </div>
        ))};
    </div>)
}