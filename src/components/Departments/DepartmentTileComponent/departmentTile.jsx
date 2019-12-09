import React from 'react';
import './departmentTile.component.scss';
import {Link} from "react-router-dom";


const DepartmentTile = ({departmentName,id,color,url}) => (
    <div style={{backgroundColor:`${color}`}} className='departmentCard'>
        <Link 
        to={`${url}${id}`}
         className='departmentContainer' align='center'>{departmentName}</Link> 
    </div>
);

export default DepartmentTile
