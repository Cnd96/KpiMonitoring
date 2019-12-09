
export default {
    items: [
          {
            title: true,
            name: 'Brandix ',
            wrapper: {
              element: '',
              attributes: {},
            },
          },
          {
            name: 'Departments',
            url: '/nervecenter/home/departments',
            icon: 'icon-globe',
          },
          {
            name: 'Record',
            url: '/nervecenter/home/dailyRecords/roleWise/enter',
            icon: 'icon-pencil',
          },
          {
            name: 'Department Audit',
            url: '/nervecenter/home/recordHistory',
            icon: 'icon-graph',
          },
          {
            name: 'Plant Admin',
            url: '/nervecenter/home/plantadmin',
            icon: 'icon-user',
            children: [
              {
                name: 'Users',
                url: '/nervecenter/home/plantadmin/users',
                icon: 'icon-cursor',
              },
              {
                name: 'Roles',
                url: '/nervecenter/home/plantadmin/roles',
                icon: 'icon-cursor',
              },
              {
                name: 'KPI',
                url: '/nervecenter/home/plantadmin/kpis',
                icon: 'icon-cursor',
              },
              {
                name: 'Departments',
                url: '/nervecenter/home/plantadmin/departments',
                icon: 'icon-cursor',
              },
              {
                name: 'Records Status',
                url: '/nervecenter/home/plantadmin/viewRecordStatus',
                icon: 'icon-cursor',
              },
            ],
          }, 
         
    ],
  };
  