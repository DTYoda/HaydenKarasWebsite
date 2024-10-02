'use client'
import { useState } from "react"

export default function EducationSection() {
    let [currentCategory, setCategory] = useState("coursework");
    let categories = ["coursework", "certifications", "courses"];

    let tableContent = {
        coursework: [
            ["Introduction to Technology", "2021-2022", "A+"],
            ["AP Computer Science A", "2022-2023", "A+"],
            ["AP Computer Science P", "2023-2024", "A+"],
            ["AP Physics I", "2023-2024", "A+"],
            ["AP Statistics", "2023-2024", "A+"],
            ["AP Calculus AB", "2023-2024", "A+"],
            ["Programming with Python Dual Enrollment", "2023-2024", "A+"],
            ["AP Calculus BC", "2024-2025", "A+"],
            ["Cyber Security Dual Enrollment", "2024-2025", "A+"],
        ],
        certifications: [
            ["Web Development", "2022", "YouScience"],
            ["Game Development", "2022", "YouScience"],
            ["Computer Science P", "2023", "YouScience"],
            ["Game Development Profficiency", "2023", "Unity"],
            ["Programming I", "2024", "YouScience"],
            ["Programming II (Python)", "2024", "YouScience"],
        ],
        courses: [
            ["CS50x", "2021-2022", "Harvard Universiity"],
            ["Create with Code", "2022-2023", "Unity"],
            ["Junior Programmer", "2024-2025", "Unity"],
            ["Full Stack Web Development", "2024", "Udemy"]
        ]
    };

    return (<div className="h-screen w-screen flex flex-col">
        <div className="flex justify-center shrink-0 gap-8 sm:text-3xl text-xl h-14">
            {categories.map(category => <button key={category} className={"hover:underline " + (currentCategory == category ? "underline" : "")} onClick={() => {setCategory(category)}}>{category}</button>)}
        </div>
        <div className="flex justify-center items-center grow">
            <table className="border-4 divide-y divide-gray-200 dark:divide-neutral-700 max-w-7xl w-[100vw] h-[90%]">
                <thead>
                    {currentCategory == "coursework" && <tr>
                        <th className="w-[50%] px-6 py-3 text-start text-xs font-medium uppercase text-neutral-500">Class</th>
                        <th className="w-[25%] px-6 py-3 text-start text-xs font-medium uppercase text-neutral-500">Year</th>
                        <th className="w-[25%] px-6 py-3 text-start text-xs font-medium uppercase text-neutral-500">Grade</th>
                    </tr>}

                    {currentCategory == "certifications" && <tr>
                        <th className="w-[50%] px-6 py-3 text-start text-xs font-medium uppercase text-neutral-500">Certification</th>
                        <th className="w-[25%] px-6 py-3 text-start text-xs font-medium uppercase text-neutral-500">Year</th>
                        <th className="w-[25%] px-6 py-3 text-start text-xs font-medium uppercase text-neutral-500">Company</th>
                    </tr>}

                    {currentCategory == "courses" && <tr>
                        <th className="w-[50%] px-6 py-3 text-start text-xs font-medium uppercase text-neutral-500">Course</th>
                        <th className="w-[25%] px-6 py-3 text-start text-xs font-medium uppercase text-neutral-500">Year</th>
                        <th className="w-[25%] px-6 py-3 text-start text-xs font-medium uppercase text-neutral-500">Company</th>
                    </tr>}
                    
                </thead>
                
                    <tbody>
                        {tableContent[currentCategory].map((row, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-900 dark:text-neutral-400">{row[0]}</td>
                                <td>{row[1]}</td>
                                <td>{row[2]}</td>
                            </tr>
                        ))}
                    </tbody>
            </table>
        </div>
    </div>)
}