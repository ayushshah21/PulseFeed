/* eslint-disable react/prop-types */
import { useState } from "react";

const Form = ({ user }) => {
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

  
  const handleSaveTopics = async () => {
    const baseURL = "http://127.0.0.1:5001"; // Make sure this URL is correct and points to your backend
    const keywords = topics.join(", "); // Join all topics to form a single string separated by commas
    console.log(user.email); // Logging user email for debugging, you might want to remove this in production

    try {
      const response = await fetch(`${baseURL}/?keywords=${encodeURIComponent(keywords)}`, {
        method: "GET", // or 'POST' if your backend expects a POST request
      });

      if (response.ok) {
        const data = await response.json(); // Assuming the response is JSON
        console.log(data); // Log or handle the response data as needed
      } else {
        console.error("Response not OK:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
      <button type="button" className="save-button" onClick={handleSaveTopics}>
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
