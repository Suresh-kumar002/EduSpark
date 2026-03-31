async function analyze() {
    let fileInput = document.getElementById("resume");
    let jobDesc = document.getElementById("jobDesc").value;

    let formData = new FormData();
    formData.append("resume", fileInput.files[0]);
    formData.append("job_description", jobDesc);

    let response = await fetch("/analyze", {
        method: "POST",
        body: formData
    });

    let data = await response.json();

    if (data.error) {
        alert(data.error);
        return;
    }

    let score = data.score;

    document.getElementById("result").innerText = "Match Score: " + score + "%";

    let bar = document.getElementById("bar");
    bar.style.width = score + "%";

    if (score < 40) bar.style.background = "red";
    else if (score < 70) bar.style.background = "orange";
    else bar.style.background = "green";
}