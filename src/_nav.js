export default {
  items: [
    {
      title: true,
      name: 'Brandix Essentials',
      wrapper: {
        element: '',
        attributes: {},
      },
    },
    // {
    //   title: true,
    //   name: 'Dasdboard',
    //   wrapper: {
    //     element: '',
    //     attributes: {},
    //   },
    // },
    {
      name: 'Dasdboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
      },
    },
    // {
    //   title: true,
    //   name: 'Departments',
    //   wrapper: {
    //     element: '',
    //     attributes: {},
    //   },
    // },
    {
      name: 'Departments',
      url: '/departments',
      icon: 'icon-globe',
    },
    // {
    //   title: true,
    //   name: 'KPIs',
    //   wrapper: {
    //     element: '',
    //     attributes: {},
    //   },
    // },
    {
      name: 'KPIs',
      url: '/kpi',
      icon: 'icon-graph',
      children: [
        {
          name: 'KPI List',
          url: '/kpi/list',
          icon: 'icon-cursor',
        },
        {
          name: 'Add KPI',
          url: '/kpi/addKpi',
          icon: 'icon-cursor',
        },
      ],
    },
    // {
    //   title: true,
    //   name: 'Daily Records',
    //   wrapper: {
    //     element: '',
    //     attributes: {},
    //   },
    // },
    {
      name: 'Daily Record',
      url: '/dailyRecords',
      icon: 'icon-pencil',
      children: [
        {
          name: 'Enter',
          url: '/dailyRecords/Enter',
          icon: 'icon-cursor',
        },
        {
          name: 'View',
          url: '/dailyRecords/View',
          icon: 'icon-cursor',
        },
      ],
    },
    {
      name: 'Reports',
      url: '/reports',
      icon: 'icon-chart',
    },
    //  {
    //   title: true,
    //   name: 'Users',
    //   wrapper: {
    //     element: '',
    //     attributes: {},
    //   },
    // },
    // {
    //   name: 'Plant Admin',
    //   url: '/plantadmin',
    //   icon: 'icon-user',
    //   children: [
    //     {
    //       name: 'KPI',
    //       url: '/plantadmin/kpis',
    //       icon: 'icon-cursor',
    //     },
    //     {
    //       name: 'Departments',
    //       url: '/plantadmin/departments',
    //       icon: 'icon-cursor',
    //     },
    //   ],
    // },

    // {
    //   name: 'Cluster Admin',
    //   url: '/clusteradmin',
    //   icon: 'icon-user',
    //   children: [
    //     {
    //       name: 'KPI',
    //       url: '/clusteradmin/kpis',
    //       icon: 'icon-cursor',
    //     },
    //     {
    //       name: 'Measuring Units',
    //       url: '/clusteradmin/measuringUnits',
    //       icon: 'icon-cursor',
    //     },
    //      {
    //       name: 'Category',
    //       url: '/clusteradmin/category',
    //       icon: 'icon-cursor',
    //     },
    //   ],
    // },
  ],
};
