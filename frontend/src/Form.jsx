

const Form = () => {
  return (
    <div className="keyword-form">
      <label htmlFor="keywords">Topics you are interested in</label>
      <input type="text" placeholder="Enter topic" />
      <label htmlFor="frequency">How often do you want to be emailed</label>
      <input type="text" placeholder="Enter days" />
    </div>
  );
};

export default Form;
