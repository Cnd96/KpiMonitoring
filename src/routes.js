import React from 'react';


const DepartmentContainer = React.lazy(() => import('./components/Departments/DepartmentsContainer/Department.Container'));
const Department= React.lazy(() => import('./components/Departments/departmentComponent/department.component'));
const DepartmentKpiHistoryContainer= React.lazy(() => import('./components/Departments/DepartmentKpiHistory/DepartmentKpiHistory.container'));

const EnterContainer= React.lazy(() => import('./components/DailyRecord/EnterContainer/EnterContainer'));
const AdminCategory= React.lazy(() => import('./components/AdminCategory/AdminCategoryComponent/adminCategoryComponent'));
const MeasuringUnitContainer= React.lazy(() => import('./components/AdminMeasuringUnits/MeasurinUnitContaoner/measurinUnit.component'));
const AdminKpiContainer= React.lazy(() => import('./components/AdminKpi/AdminKpiContainer/adminKpiContainer'));
const AdminRolesComponent= React.lazy(() => import('./components/AdminRoles/AdminRoles'));
const AdminPlantsContainer= React.lazy(() => import('./components/AdminPlants/AdminPlantsContainer'));

const EnterKpiScoreRoleWiseContainer= React.lazy(() => import('./components/KpiScoreRecord/RoleWiseRecord/RoleWiseRecord.component'));

const AssignKpiPlantContainer= React.lazy(() => import('./components/PlantAdmin/PlAdminKPI/AssignKpiComponent/assignKpi'));
const UpdateDepartmentKpiContainer= React.lazy(() => import('./components/PlantAdmin/PlAdminDepartments/UpdateStandardScore/updateStandardScore'));
const PlantAdminDepartmentContainer= React.lazy(() => import('./components/PlantAdmin/PlAdminDepartments/DepartmentContainer/PlantAdminDepartmentContainer'));
const CreateDepartmentComponent= React.lazy(() => import('./components/PlantAdmin/PlAdminDepartments/DepartmentForm/DepartmentForm'));
const EditDepartmentComponent= React.lazy(() => import('./components/PlantAdmin/PlAdminDepartments/EditDepartment/editdepartment.component'));
const PlantAdminRoleComponent= React.lazy(() => import('./components/PlantAdmin/PlAdminRoles/PlAdminRoles'));
const PlantAdminUserComponent= React.lazy(() => import('./components/PlantAdmin/PlAdminUsers/plAdminUsers.component'));
const PlantAdminCreateUserComponent= React.lazy(() => import('./components/PlantAdmin/PlAdminUsers/PlAdminAddUser/PlAdminAddUser.component'));
const PlantAdminEditUserComponent= React.lazy(() => import('./components/PlantAdmin/PlAdminUsers/PlAdminEditUser/PlAdminEditUser.component'));
const KpiScoreRecordHistoryContainer= React.lazy(() => import('./components/KpiScoreRecordHistory/KpiRecordHistoryContainer'));
const PlAdminViewRecordStatusContainer= React.lazy(() => import('./components/PlantAdmin/PlantAdminViewRecordStatus/PlAdminViewRecordStatus'));

const DashboardContainer= React.lazy(() => import('./components/Dashboard/DashboardContainer'));

const routes = [
  { path: '/nervecenter/home', exact: true, name: 'Home' ,component: DepartmentContainer  },
  // { path: '/dashboard', name: 'Dashboard', component: DashboardContainer },
  { path: '/nervecenter/home/departments', exact: true, name: 'Departments', component: DepartmentContainer },
  { path: '/nervecenter/home/recordHistory', exact: true, name: 'Department Audit', component: KpiScoreRecordHistoryContainer },
  { path: '/nervecenter/home/departments/:id', exact: true, name: 'Department', component: Department },
  { path: '/nervecenter/home/department/kpiHistory/:kpiId/:departmentId', exact: true, name: 'Department KPI Target Achivement', component: DepartmentKpiHistoryContainer },

  { path: '/nervecenter/home/dailyRecords/departmentWise/enter', exact: true, name: 'Enter Actual Score', component: EnterContainer },
  { path: '/nervecenter/home/dailyRecords/roleWise/enter', exact: true, name: 'Enter Actual Score', component: EnterKpiScoreRoleWiseContainer },

  { path: '/nervecenter/home/clusteradmin/category', exact: true, name: 'Admin Category', component: AdminCategory },
  { path: '/nervecenter/home/clusteradmin/roles', exact: true, name: 'Admin Roles', component: AdminRolesComponent },
  { path: '/nervecenter/home/clusteradmin/measuringUnits', exact: true, name: 'Admin Measuring Units', component: MeasuringUnitContainer },
  { path: '/nervecenter/home/clusteradmin/kpis', exact: true, name: 'Admin KPI', component: AdminKpiContainer },
  { path: '/nervecenter/home/clusteradmin/plants', exact: true, name: 'Admin KPI', component: AdminPlantsContainer },

  { path: '/nervecenter/home/plantadmin/roles', exact: true, name: 'Plant Admin Roles', component: PlantAdminRoleComponent },
  { path: '/nervecenter/home/plantadmin/viewRecordStatus', exact: true, name: 'Plant Departments Audit', component: PlAdminViewRecordStatusContainer },
  { path: '/nervecenter/home/plantadmin/users', exact: true, name: 'Plant Users', component: PlantAdminUserComponent },
  { path: '/nervecenter/home/plantadmin/createUser', exact: true, name: 'Plant Admin Create User', component: PlantAdminCreateUserComponent },
  { path: '/nervecenter/home/plantadmin/kpis', exact: true, name: 'Plant KPIs', component: AssignKpiPlantContainer },
  { path: '/nervecenter/home/plantadmin/departments', exact: true, name: 'Plant Departments', component: PlantAdminDepartmentContainer },
  { path: '/nervecenter/home/plantadmin/createDepartment', exact: true, name: 'Plant Admin Create Department', component: CreateDepartmentComponent },
  { path: '/nervecenter/home/plantadmin/editDepartment/:id', exact: true, name: 'Plant Admin Edit Department', component: EditDepartmentComponent },
  { path: '/nervecenter/home/plantadmin/users/:userId', exact: true, name: 'Plant Admin Edit User', component: PlantAdminEditUserComponent },
  { path: '/nervecenter/home/plantadmin/updateKPI/:departmentId/:kpiId/:departmentName', exact: true, name: 'Plant KPIs Update', component: UpdateDepartmentKpiContainer },
];

export default routes;
