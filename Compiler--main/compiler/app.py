from flask import Flask, request, jsonify, render_template
import subprocess
import os
import uuid

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/run", methods=["POST"])
def run_code():

    data = request.json
    language = data.get("language")
    code = data.get("code")
    user_input = data.get("input", "")

    file_id = str(uuid.uuid4())

    try:

        # PYTHON
        if language == "python":

            filename = f"{file_id}.py"

            with open(filename, "w") as f:
                f.write(code)

            result = subprocess.run(
                ["python", filename],
                input=user_input,
                capture_output=True,
                text=True,
                timeout=5
            )

            os.remove(filename)

            return jsonify({"output": result.stdout or result.stderr})


        # JAVASCRIPT
        elif language == "javascript":

            filename = f"{file_id}.js"

            with open(filename, "w") as f:
                f.write(code)

            result = subprocess.run(
                ["node", filename],
                input=user_input,
                capture_output=True,
                text=True,
                timeout=5
            )

            os.remove(filename)

            return jsonify({"output": result.stdout or result.stderr})


        # C++
        elif language == "cpp":

            cpp_file = f"{file_id}.cpp"
            exe_file = f"{file_id}.exe"

            with open(cpp_file, "w") as f:
                f.write(code)

            compile = subprocess.run(
                ["g++", cpp_file, "-o", exe_file],
                capture_output=True,
                text=True
            )

            if compile.stderr:
                os.remove(cpp_file)
                return jsonify({"output": compile.stderr})

            result = subprocess.run(
                [exe_file],
                input=user_input,
                capture_output=True,
                text=True,
                timeout=5
            )

            os.remove(cpp_file)
            os.remove(exe_file)

            return jsonify({"output": result.stdout or result.stderr})


        # JAVA
        elif language == "java":

            java_file = "Main.java"

            with open(java_file, "w") as f:
                f.write(code)

            compile = subprocess.run(
                ["javac", java_file],
                capture_output=True,
                text=True
            )

            if compile.stderr:
                return jsonify({"output": compile.stderr})

            result = subprocess.run(
                ["java", "Main"],
                input=user_input,
                capture_output=True,
                text=True,
                timeout=5
            )

            os.remove("Main.java")
            os.remove("Main.class")

            return jsonify({"output": result.stdout or result.stderr})


        # C#
        elif language == "csharp":

            cs_file = f"{file_id}.cs"
            exe_file = f"{file_id}.exe"

            with open(cs_file, "w") as f:
                f.write(code)

            compile = subprocess.run(
                ["csc", cs_file],
                capture_output=True,
                text=True
            )

            if compile.stderr:
                os.remove(cs_file)
                return jsonify({"output": compile.stderr})

            result = subprocess.run(
                [exe_file],
                input=user_input,
                capture_output=True,
                text=True,
                timeout=5
            )

            os.remove(cs_file)
            os.remove(exe_file)

            return jsonify({"output": result.stdout or result.stderr})


        else:
            return jsonify({"output": "Language not supported"})


    except subprocess.TimeoutExpired:
        return jsonify({"output": "Error: Code execution timeout (possible infinite loop)"})


    except Exception as e:
        return jsonify({"output": str(e)})


if __name__ == "__main__":
    app.run(debug=True,port=3000)