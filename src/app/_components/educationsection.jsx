"use client";
import { useState } from "react";
import DropDown from "./educationdropdown";
import EdcuationTable from "./educationtable";

export default function EducationSection() {
  let [currentCategory, setCategory] = useState("coursework");
  let categories = ["coursework", "certifications", "courses", "awards"];

  let [currentIndex, setIndex] = useState("");

  let tableContent = {
    coursework: [
      ["AP Computer Science A", "2022-2023", "A+"],
      ["AP Computer Science P", "2023-2024", "A+"],
      ["AP Physics I", "2023-2024", "A+"],
      ["AP Statistics", "2023-2024", "A+"],
      ["AP Calculus AB/BC", "2023-2024", "A+"],
      ["Programming with Python Dual Enrollment", "2023-2024", "A+"],
      ["Cyber Security Dual Enrollment", "2024-2025", "A+"],
    ],
    certifications: [
      {
        title: "Web Development",
        desc: "YouScience certification exam that covers the fundementals of HTML, CSS, and JavsScript, as well as best practices and vocabulary. This exam was taken as a part of my Digital Media class in 2022",
        link: "YouScience",
        linkName: "View the Certificate",
      },
      {
        title: "Computer Science P",
        desc: "YouScience certification exam that covers the fundementals of computer science, algorithms, binary, and logic, as well as best practices, internet saftey, and ethics. This exam was taken as a part of my Digital Media class in 2023",
        link: "YouScience",
        linkName: "View the Certificate",
      },
      {
        title: "Game Development Profficiency",
        desc: "This certification was given at the SkillsUSA Natioal Game Development competition to students who demonstrated profficiency in the Game Developemnt fundementals and scored high enough on the rubric. This certification is signed by executives at Epic Games and Unity",
        link: "YouScience",
        linkName: "View the Certificate",
      },
      {
        title: "Programming I",
        desc: "YouScience certification on the fundementals of programming. Covers functions, algorithms, variables, and much more. Taken independanty in 2024, recieving a score of 100%.",
        link: "YouScience",
        linkName: "View the Certificate",
      },
      {
        title: "Programming II (Python)",
        desc: "YouScience certification covering object oriented programming within python. Covering inheritance, constructors, inner functions, and much more. Taken independanty in 2024.",
        link: "YouScience",
        linkName: "View the Certificate",
      },
      {
        title: "Game Development",
        desc: "YouScience exam covering the basics of video game development, covering character/level design, the steps of game development, development process, and much more. Taken in 2022 as a part of my Interactive Digital Media class",
        link: "YouScience",
        linkName: "View the Certificate",
      },
    ],
    courses: [
      {
        title: "CS50x: Introduction to Computer Science by Harvard University",
        desc: "A famous Computer Science course free online for anybody to take. Covers C, Python, SQL, Flask, Web Development, Algorithms, and much more. Paid for verified certficate and completed the 'advanced' route for each problem set. Completed course thorughout freshman and sophomore year of highschool, and created a full-stack web application with SQL, Flask, and Python for final project.",
        link: "",
        linkName: "View the Certificate",
      },
      {
        title: "Create with Code by Unity",
        desc: "Unity project that brings you through the fundementals of the game engine, covers use of the C# programming language, game objects, events, and much more. Taken as a part of my Interactive Digital Media Class at school, and created various small projects while taking the course",
        link: "",
        linkName: "View the Course",
      },
      {
        title: "Junior Programmer by Unity",
        desc: "An addition to the Create with Code course, Junior Programmer focuses more heavily on the use of the C# programming language rather than the Unity Game Engine as a whole. Coveres everything from basic variables to Coroutines, functions, and much more. Taken as a part of my Interactive Digital Media Class.",
        link: "",
        linkName: "View the Course",
      },
      {
        title: "Full Stack Web Development Course by Udemy",
        desc: "This >100 hour course goes in detail to everything needed to be a full-stack web developer. The course brings you though various projects and learning activities to teach advanced HTMl, CSS, JavaScript, NodeJS, ExpressJS, ReactJS, SQL, and more. The course covers everything from simple examples to high level projects This course was done independantly throughout 2024",
        link: "",
        linkName: "View the Course",
      },
    ],
    awards: [
      ["Game Development State Competition 1st Place (2023)", "2022", "Unity"],
      ["Game Development State Competition 1st Place (2024)", "2022", "Unity"],
      ["Game Development National Profficiency (2023)", "2023", "YouScience"],
      ["Game Development National Profficiency (2024)", "2023", "YouScience"],
    ],
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <h1 className="sm:text-[4vw] text-[10vw] p-8 text-center text-7xl uppercase">
        EDUCATION
      </h1>
      <div className="flex justify-center flex-wrap shrink-0 gap-8 sm:text-3xl text-xl h-14">
        {categories.map((category) => (
          <button
            key={category}
            className={
              "hover:underline " +
              (currentCategory == category ? "underline" : "")
            }
            onClick={() => {
              setCategory(category);
            }}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="flex flex-col items-center grow">
        {tableContent[currentCategory].map((index) => {
          return (
            <div className="py-4">
              <DropDown
                title={index["title"]}
                desc={index["desc"]}
                onClick={setIndex}
                currentActive={currentIndex}
                to={index["link"]}
                linkName={index["linkName"]}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
