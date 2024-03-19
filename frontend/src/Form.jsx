/* eslint-disable react/prop-types */
import { useState } from "react";

const Form = ({user}) => {
  const [topics, setTopics] = useState([""]);

  const handleAddTopic = () => {
    setTopics([...topics, ""]);
  };

  const handleDeleteTopic = (index) => {
    const newTopics = topics.filter((_, idx) => idx !== index);
    setTopics(newTopics);
  };

  const handleChangeTopic = (index, value) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };
  const handleSaveTopic = (index, value) => {
    const baseURL = "http://127.0.0.1:5000"
    console.log(user.email);
    // const newTopics = [...topics];
    // newTopics[index] = value;
    // setTopics(newTopics);
  };


  return (
    <form className="keyword-form">
      {topics.map((topic, index) => (
        <div className="topic-wrapper" key={index}>
          <div className="topic-label">Topic {index + 1}</div>
          <input
            type="text"
            placeholder="Enter topic"
            id={`topic-${index}`}
            value={topic}
            onChange={(e) => handleChangeTopic(index, e.target.value)}
          />
          {topics.length > 1 && (
            <button
              type="button"
              className="delete-button"
              onClick={() => handleDeleteTopic(index)}
            >
              X
            </button>
          )}
        </div>
      ))}
      <button type="button" className="add-button" onClick={handleAddTopic}>
        Add Topic
      </button>
      <button type="button" className="save-button" onClick={handleSaveTopic}>
        Save
      </button>

      <label
        htmlFor="frequency"
        style={{ display: "block", marginTop: "20px" }}
      >
        How often do you want to be emailed
      </label>
      <input type="text" placeholder="Enter days" id="frequency" />
    </form>
  );
};

export default Form;
