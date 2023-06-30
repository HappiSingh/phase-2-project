
import React, { useState } from "react";

function Form({ onFormSubmit }){
    // 3 states added to store default form information
    const [formType, setFormType] = useState(true)
    const [targetData, setTargetData] = useState({
        name: "",
        progress: ""
    })
    const [triumphData, setTriumphData] = useState({
        name: "",
        completed: ""
    })

    // checks the selected form type (dropdown)
    const handleFormTypeChange = () => {
        setFormType(!formType);
    }

    // true means targets data / false means triumphs data
    const handleChange = (e) => {
        if(formType){
            setTargetData({
                ...targetData,
                [e.target.name]: e.target.value,
              })
        } else{
            setTriumphData({
                ...triumphData,
                [e.target.name]: e.target.value,
              });
        };
    };

    // submitting entered date to db and setting the new state
    const handleSubmit = (e) => {
        e.preventDefault()

    // checking dropdown type
        let type;
        if (formType) { type = "targets"}
            else { type = "triumphs"}

        fetch(`http://localhost:4000/${type}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(formType 
                ? targetData 
                : triumphData)
            })
                .then(res => res.json())
                .then(newData => onFormSubmit(newData, type))

    // clearing the input fields after submit
        formType 
        ? setTargetData({name: "", progress: ""}) 
        : setTriumphData({name: "", completed: ""})
    };


    return(
        <section id="form-section">
            <h2>Add a new target or a triumph:</h2>
            <form onSubmit={handleSubmit}>
                <select 
                    name="form-type"
                    onChange={handleFormTypeChange}
                    >
                    <option value="target">Target</option>
                    <option value="triumph">Triumph</option>
                </select>
                <input 
                    onChange={handleChange}
                    className="description"
                    type="text"
                    placeholder="Description"
                    name="name"
                    value={formType ? targetData.name : triumphData.name}
                    />
                
                { 
                // Ternary operator to determine which kind of form we are completing, based off of the dropdown selection.
                formType ?
                    <label>% Complete
                    <input 
                        onChange={handleChange}
                        type="number"
                        placeholder="0"
                        name="progress"
                        value={targetData.progress}
                        />
                    </label> : 
                    <label>Completion Date:
                    <input 
                        onChange={handleChange}
                        type="text"
                        placeholder="Ex. May 2020"
                        name="completed"
                        value={triumphData.completed}
                        />
                    </label>
                }
                <button type="submit">Add</button>
            </form>
        </section>
    );
}

export default Form;