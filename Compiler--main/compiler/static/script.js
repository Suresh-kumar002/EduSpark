document.addEventListener("DOMContentLoaded", function () {

  const codeArea = document.querySelector(".code-area");
  const inputArea = document.querySelector(".input-area");
  const outputArea = document.querySelector(".output-area");
  const runButton = document.getElementById("run-button");
  const languageSelect = document.getElementById("language-select");
  const lineNumbers = document.querySelector(".line-numbers");
  const themeToggle = document.querySelector(".theme-toggle");

  
        //LINE NUMBERS


  function updateLineNumbers() {
    const lines = codeArea.value.split("\n").length;
    let numbers = "";

    for (let i = 1; i <= lines; i++) {
      numbers += i + "\n";
    }

    lineNumbers.textContent = numbers;
  }

  updateLineNumbers();

  codeArea.addEventListener("input", updateLineNumbers);

  
        //TAB SUPPORT


  codeArea.addEventListener("keydown", function (e) {

    if (e.key === "Tab") {
      e.preventDefault();

      const start = this.selectionStart;
      const end = this.selectionEnd;

      this.value =
        this.value.substring(0, start) +
        "    " +
        this.value.substring(end);

      this.selectionStart = this.selectionEnd = start + 4;
      updateLineNumbers();
    }

    if (e.ctrlKey && e.key === "Enter") {
      executeCode();
    }
  });

  
       // RUN CODE (FLASK API)

  async function executeCode() {

    const code = codeArea.value;
    const language = languageSelect.value;

    if (!language) {
      outputArea.value = "Please select a language";
      return;
    }

    if (!code) {
      outputArea.value = "No code to run";
      return;
    }

    outputArea.value = "Running...";

    try {

      const response = await fetch("/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          code: code,
          language: language
        })
      });

      const data = await response.json();

      outputArea.value = data.output;

    } catch (error) {

      outputArea.value = "Server Error: " + error;

    }

  }

  runButton.addEventListener("click", executeCode);

 
       // CLEAR EDITOR
 

  document.getElementById("clear-button").addEventListener("click", () => {

    codeArea.value = "";
    outputArea.value = "";

    updateLineNumbers();

  });


       // COPY OUTPUT


  document.getElementById("copy-output").addEventListener("click", () => {

    outputArea.select();
    document.execCommand("copy");

    alert("Output Copied!");

  });

  
       // LANGUAGE PLACEHOLDER


  function handleLanguageChange() {

    const language = languageSelect.value;

    const placeholders = {

      javascript: `// JavaScript
console.log("Hello World!");`,

      python: `# Python
print("Hello World!")`,

      java: `public class Main{
    public static void main(String[] args){
        System.out.println("Hello World!");
    }
}`,

      cpp: `#include <iostream>
using namespace std;

int main(){
cout<<"Hello World!";
return 0;
}`,

      csharp: `using System;

class Program{
static void Main(){
Console.WriteLine("Hello World!");
}
}`

    };

    codeArea.value = placeholders[language] || "";
    updateLineNumbers();

  }

  languageSelect.addEventListener("change", handleLanguageChange);

 
        //THEME TOGGLE

  function toggleTheme() {

    document.body.classList.toggle("light-theme");

    const isLight = document.body.classList.contains("light-theme");

    themeToggle.innerHTML = `<i class="fas fa-${isLight ? "moon" : "sun"}"></i>`;

    localStorage.setItem("theme", isLight ? "light" : "dark");

  }

  themeToggle.addEventListener("click", toggleTheme);

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    toggleTheme();
  }

});