import React from 'react';
import './departmentButton.styles.scss'

const DepartmentAcheivementButton = ({kpiName,achievementClass,handleKpiClick,handleOnMouseOver,handleOnMouseLeft}) => (
    <button  style={{margin:'2px',width:'96%'}}
     onClick={handleKpiClick}
     onMouseOver={handleOnMouseOver}
     onMouseLeave={handleOnMouseLeft}
     className={`${achievementClass}  btn`}>
            {kpiName}
    </button>
);

export default DepartmentAcheivementButton


