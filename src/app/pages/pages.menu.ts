export const PAGES_MENU = [
  {
    path: 'pages',
    children: [
      {
        path: 'home',
        data: {
          menu: {
            title: 'Home',
            icon: 'ion-android-home',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: 'master',
        data: {
          menu: {
            title: 'Master',
            icon: 'ion-social-buffer',
            selected: false,
            expanded: false,
            order: 1
          }
        },
        children: [
          {
            path: 'basslist',
            data: {
              menu: {
                title: 'Master Bass',
              }
            }
          },
          {
            path: 'customerlist',
            data: {
              menu: {
                title: 'Master Customer',
              }
            }
          },
          {
            path: 'teknisilist',
            data: {
              menu: {
                title: 'Master Teknisi',
              }
            }
          },
          {
            path: 'applicationlist',
            data: {
              menu: {
                title: 'Master Application',
              }
            }
          },
          {
            path: 'rolelist',
            data: {
              menu: {
                title: 'Master Role',
              }
            }
          },
          {
            path: 'karyawanlist',
            data: {
              menu: {
                title: 'Master Karyawan',
              }
            }
          },
          {
            path: 'zonalist',
            data: {
              menu: {
                title: 'Master Zona',
              }
            }
          },
          {
            path: 'kotalist',
            data: {
              menu: {
                title: 'Master Kota',
              }
            }
          },
          {
            path: 'transportasilist',
            data: {
              menu: {
                title: 'Master Transportasi',
              }
            }
          },
          {
            path: 'cabangmappinglist',
            data: {
              menu: {
                title: 'Mapping Cabang Zona',
              }
            }
          },
          {
            path: 'masterexplodedsparepart',
            data: {
              menu: {
                title: 'Master Exploded Sparepart',
              }
            }
          }
        ]
      },
      {
        path: 'service',
        data: {
          menu: {
            title: 'Service',
            icon: 'ion-android-stopwatch',
            selected: false,
            expanded: false,
            order: 2
          }
        },
        children: [
          {
            path: 'servicerequest',
            data: {
              menu: {
                title: 'Service Request',
              }
            }
          },
          {
            path: 'finishingservicerequest',
            data: {
              menu: {
                title: 'Finishing Service',
              }
            }
          },
          {
            path: 'finishingservicerequestall',
            data: {
              menu: {
                title: 'Finishing Service All',
              }
            }
          },
          {
            path: 'claimservice',
            data: {
              menu: {
                title: 'Claim Service',
              }
            }
          },
          {
            path: 'claimlist',
            data: {
              menu: {
                title: 'List Claim',
              }
            }
          },
          {
            path: 'reviewclaimservices',
            data: {
              menu: {
                title: 'Review Claim Service',
              }
            }
          },
          {
            path: 'paidclaimservices',
            data: {
              menu: {
                title: 'Paid Claim Service',
              }
            }
          }
        ]
      },
      {
        path: 'part',
        data: {
          menu: {
            title: 'Part',
            icon: 'ion-filing',
            selected: false,
            expanded: false,
            order: 3
          }
        },
        children: [
          {
            path: 'partorder',
            data: {
              menu: {
                title: 'Part Order',
              }
            }
          },
          {
            path: 'partreceiving',
            data: {
              menu: {
                title: 'Part Receiving',
              }
            }
          },
          {
            path: 'invoicelist',
            data: {
              menu: {
                title: 'List Faktur',
              }
            }
          },
          {
            path: 'partorderlist',
            data: {
              menu: {
                title: 'Maintain Part Order',
              }
            }
          }
        ]
      },
      {
        path: 'report',
        data: {
          menu: {
            title: 'Report',
            icon: 'ion-android-clipboard',
            selected: false,
            expanded: false,
            order: 4
          }
        },
        children: [
          {
            path: 'reportsclaim',
            data: {
              menu: {
                title: 'Claim Report',
              }
            }
          },
          {
            path: 'reportsservicerequest',
            data: {
              menu: {
                title: 'Service List Report',
              }
            }
          },
          {
            path: 'reportsfinishingservice',
            data: {
              menu: {
                title: 'Finishing Service Report',
              }
            }
          },
          {
            path: 'reportsrejectedservice',
            data: {
              menu: {
                title: 'Rejected Service Report',
              }
            }
          },
          {
            path: 'reportspartorder',
            data: {
              menu: {
                title: 'Part Order Report',
              }
            }
          },
          {
            path: 'reportspartreceiving',
            data: {
              menu: {
                title: 'Part Receiving Report',
              }
            }
          }
        ]
      },
      {
        path: 'settings',
        data: {
          menu: {
            title: 'Setting',
            icon: 'ion-settings',
            selected: false,
            expanded: false,
            order: 5
          }
        },
        children: [
          {
            path: 'generalsetting',
            data: {
              menu: {
                title: 'General Setting',
              }
            }
          }
        ]
      },
      {
        path: 'password',
        data: {
          menu: {
            title: 'Change Password',
            icon: 'ion-android-lock',
            selected: false,
            expanded: false,
            order: 6
          }
        }
      }
    ]
  }
];
