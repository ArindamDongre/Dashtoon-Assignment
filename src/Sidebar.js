import React, { useState } from "react";
import "./Sidebar.css";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const Sidebar = ({ panelTexts, handleInputChange, handleSubmit, loading }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="expand-icon" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </div>
      {!collapsed && (
        <form onSubmit={handleSubmit} className="sidebar-content">
          <h2>Enter text to generate comic:</h2>
          {panelTexts.map((text, index) => (
            <div key={index} className="panel-input">
              <label>{`Panel ${index + 1}:`}</label>
              <input
                type="text"
                value={text}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            </div>
          ))}
          <button type="submit" disabled={loading}>
            Generate Comic
          </button>
        </form>
      )}
    </div>
  );
};

export default Sidebar;
