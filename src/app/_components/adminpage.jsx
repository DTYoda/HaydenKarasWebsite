"use client"

import { useState } from "react";
import { useRouter } from "next/navigation"

export default function AdminPage() {
    
    const [skills, setSkills] = useState({category: "languages", name: "", description: "", type: "new", oldName: ""});
    const [education, setEducation] = useState({oldName: "", type: "new", category: "coursework", name: "", description: "", link: "", linkText: ""});
    const router = useRouter();

    async function SubmitSkillsToDatabase(e)
    {
        e.preventDefault();

        const response = await fetch("/api/skillshandler", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(skills),
          });
        if(response.status == 200)
        {
            
        }
    }

    async function SubmitEducationToDatabase(e)
    {
        e.preventDefault();
        const response = await fetch("/api/educationhandler", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(education),
          });

        if(response.status == 200)
        {
            router.refresh();
        }
    }

    async function SubmitProjectToDatabase(e)
    {
    }



    if(false)
    {
        return <div className="w-full min-h-screen flex flex-col items-center gap-8">
            <div className="xl:w-[60vw] md:w-[80vw] w-[100vw] mt-8">
                <h1 className="text-center lg:text-7xl mb-2">Admin Page</h1>
                <p className="text-center">Welcome to the admin dashboard.</p>
                <p className="text-center">Here you can manage your content and settings.</p>
            </div>
            <div className="w-[40vw] h-[20vw] rounded-xl bg-gray-600 p-4" onSubmit={SubmitSkillsToDatabase}>
                <p className="bg-black text-white rounded-xl px-3 block w-fit text-center underline">Skills</p>
                <form>
                    <select className="m-1 w-1/4 bg-black text-white rounded-xl px-3" name="type" onChange={(e) => setSkills({ ...skills, type: e.target.value })}>
                        <option value="new">New</option>
                        <option value="edit">Edit</option>
                        <option value="delete">Delete</option>
                    </select>
                    
                    {skills.type != "delete" && <select className="w-1/4 bg-black text-white rounded-xl mb-4 px-3" name="category" onChange={(e) => setSkills({ ...skills, category: e.target.value })}>
                        <option value="languages">Language</option>
                        <option value="frameworks">Framework</option>
                        <option value="skills">Skill</option>
                    </select>}
                    <br />
                    {skills.type == "edit" && <input className="w-full bg-black text-white rounded-xl px-3 mb-1" type="text" placeholder="Old Name" onChange={(e) => setSkills({ ...skills, oldName: e.target.value })}></input>}
                    <input className="w-full bg-black text-white rounded-xl px-3" type="text" placeholder="Name" onChange={(e) => setSkills({ ...skills, name: e.target.value })}></input>
                    {skills.type != "delete" && <textarea className="bg-black text-white w-full mb-4 mt-1 rounded-xl px-3 h-[8vw]" type="text" placeholder="description" onChange={(e) => setSkills({ ...skills, description: e.target.value })}></textarea>}
                    <br />
                    <button className="bg-black text-white rounded-xl px-3 mt-1" type="submit">Submit</button>
                </form>
            </div>
            <div className="p-4 w-[40vw] h-[20vw] rounded-xl bg-gray-600" onSubmit={SubmitEducationToDatabase}>
                <form>
                    <p className="underline bg-black text-white rounded-xl px-3 block w-fit text-center">Education</p>
                    <select className="m-1 w-1/4 bg-black text-white rounded-xl px-3" name="type" onChange={(e) => setEducation({ ...education, type: e.target.value })}>
                        <option value="new">New</option>
                        <option value="edit">Edit</option>
                        <option value="delete">Delete</option>
                    </select>
                    {education.type != "delete" && <select className="w-1/4 bg-black text-white rounded-xl mb-4 px-3" name="category" onChange={(e) => setEducation({ ...education, category: e.target.value })}>
                        <option value="coursework">Coursework</option>
                        <option value="certifications">Certification</option>
                        <option value="courses">Course</option>
                        <option value="awards">Award</option>
                    </select>}
                    <br></br>
                    {education.type == "edit" && <input className="w-full bg-black text-white rounded-xl px-3 mb-1" type="text" placeholder="Old Name" onChange={(e) => setEducation({ ...education, oldName: e.target.value })}></input>}
                    <input className="w-full bg-black text-white rounded-xl px-3" type="text" placeholder="Name" onChange={(e) => setEducation({ ...education, name: e.target.value })}></input>
                    <br></br>
                    {education.type != "delete" && <textarea className="bg-black text-white w-full mb-4 mt-1 rounded-xl px-3 h-[8vw]" type="text" placeholder="description" onChange={(e) => setEducation({ ...education, description: e.target.value })}></textarea>}
                    <br />
                    {education.type != "delete" && <input className="bg-black text-white rounded-xl px-3" type="text" placeholder="link" onChange={(e) => setEducation({ ...education, link: e.target.value })}></input>}
                    {education.type != "delete" && <input className="bg-black text-white rounded-xl px-3" type="text" placeholder="linkText" onChange={(e) => setEducation({ ...education, linkText: e.target.value })}></input>}
                    <br />
                    <button className="bg-black text-white rounded-xl px-3 mt-1" type="submit">Submit</button>
                </form>
            </div>
            <div className="w-[40vw] h-[10vw] rounded-xl bg-gray-600">

            </div>
        </div>
    }
    return <div className="w-full min-h-screen flex flex-col items-center">
    <div className="xl:w-[60vw] md:w-[80vw] w-[100vw]">
        <h1 className="text-center lg:text-7xl mt-8 mb-2">Admin Page</h1>
        <p className="text-center">You are not authorized to use this page.</p>
    </div>
</div>
}