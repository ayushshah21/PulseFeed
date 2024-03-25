/* eslint-disable no-unused-vars */
import { useState } from "react";

// eslint-disable-next-line react/prop-types
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
    const baseURL = "http://127.0.0.1:5001";
    const keywords = topics.join(", ");

    try {
      const response = await fetch(
        `${baseURL}/?keywords=${encodeURIComponent(keywords)}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.error("Response not OK:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form className="keyword-form" style={styles.form}>
      {topics.map((topic, index) => (
        <div className="topic-wrapper" key={index} style={styles.topicWrapper}>
          <div className="topic-label" style={styles.topicLabel}>
            Topic {index + 1}
          </div>
          <input
            type="text"
            placeholder="Enter topic"
            id={`topic-${index}`}
            value={topic}
            onChange={(e) => handleChangeTopic(index, e.target.value)}
            style={styles.input}
          />
          {topics.length > 1 && (
            <button
            type="button"
            className="delete-button"
            onClick={() => handleDeleteTopic(index)}
            style={styles.deleteButton}
          >
            X
          </button>
          )}
        </div>
      ))}
      <button
        type="button"
        className="add-button"
        onClick={handleAddTopic}
        style={styles.addButton}
      >
        ➕ Add Topic
      </button>
      <button
        type="button"
        className="save-button"
        onClick={handleSaveTopics}
        style={styles.saveButton}
      >
        💾 Save
      </button>

      <div style={{ marginTop: "20px" }}>
        <label htmlFor="frequency" style={styles.label}>
          How often do you want to be emailed
        </label>
        <input
          type="text"
          placeholder="Enter days"
          id="frequency"
          style={styles.input}
        />
      </div>
    </form>
  );
};

const styles = {
  form: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    background: "#f7f7f7",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  topicWrapper: {
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
  },
  topicLabel: {
    marginRight: "10px",
    fontWeight: "bold",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginRight: "5px",
  },
  addButton: {
    background: "linear-gradient(145deg, #6CC077, #4AAE5F)", // Smooth gradient
    color: "#FFF",
    padding: "10px 20px",
    border: "none",
    borderRadius: "30px", // Rounded corners
    cursor: "pointer",
    marginTop: "10px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)", // Subtle shadow for depth
    transition: "all 0.2s ease", // Smooth transition for hover effects
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "bold",
  },
  
  saveButton: {
    background: "linear-gradient(145deg, #4D9DE0, #377BCA)", // Smooth gradient
    color: "#FFF",
    padding: "10px 20px",
    border: "none",
    borderRadius: "30px", // Rounded corners
    cursor: "pointer",
    marginTop: "10px",
    marginLeft: "10px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)", // Subtle shadow for depth
    transition: "all 0.2s ease", // Smooth transition for hover effects
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "bold",
  },

  deleteButton: {
    background: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    padding: "5px 10px",
    fontSize: "16px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
  },
};


export default Form;
