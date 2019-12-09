import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const PlantDepartmentExpansion = ({plantDeparments,handleChangeDepartmentSelect}) => (
 <ExpansionPanel>
    <ExpansionPanelSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <Typography >Plant departments</Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
        <FormControl component="fieldset" style={{marginLeft:'15px',paddingTop:'10px'}}>
            <FormGroup>
            {
                plantDeparments.map(({id,departmentName,isSelected})=>
                <FormControlLabel
                key={id}
                checked={isSelected}
                name={departmentName}
                control={<Checkbox onChange={handleChangeDepartmentSelect} value={id} />}
                label={departmentName}
                />                       
                )
            }
            </FormGroup>
        </FormControl>                            
    </ExpansionPanelDetails>
  </ExpansionPanel>                   
);

export default PlantDepartmentExpansion
