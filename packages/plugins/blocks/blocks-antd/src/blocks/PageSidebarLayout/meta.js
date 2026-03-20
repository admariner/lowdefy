/*
  Copyright 2020-2026 Lowdefy, Inc

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import MobileMenuMeta from '../MobileMenu/meta.js';

export default {
  category: 'container',
  icons: ['AiOutlineMenuFold', 'AiOutlineMenuUnfold', ...MobileMenuMeta.icons],
  valueType: null,
  slots: [
    'content',
    'footer',
    'header',
    'mobileDrawerContent',
    'mobileDrawerFooter',
    'mobileExtra',
    'siderClosed',
    'siderOpen',
  ],
  cssKeys: {
    element: 'The PageSidebarLayout element.',
    sider: 'The PageSidebarLayout sider.',
    menu: 'The PageSidebarLayout menu.',
    mobileHeader: 'The PageSidebarLayout mobile header.',
    header: 'The PageSidebarLayout header.',
    logo: 'The PageSidebarLayout logo.',
    content: 'The PageSidebarLayout content.',
    breadcrumb: 'The PageSidebarLayout breadcrumb.',
    footer: 'The PageSidebarLayout footer.',
    toggleButton: 'The PageSidebarLayout sider toggle button.',
  },
  events: {
    onToggleSider: 'Trigger action when sider toggle button is clicked.',
    onMenuItemClick: 'Trigger action when menu item is clicked.',
    onMenuItemSelect: 'Trigger action when menu item is selected.',
    onToggleMenuGroup: 'Trigger action when menu group is opened.',
    onBreadcrumbClick: 'Trigger action when a breadcrumb item is clicked.',
    onMobileMenuOpen: 'Trigger action when mobile menu is opened.',
    onMobileMenuClose: 'Trigger action when mobile menu is closed.',
    onToggleDrawer: 'Trigger action when mobile menu drawer is toggled.',
  },
  properties: {
    type: 'object',
    additionalProperties: false,
    properties: {
      title: {
        type: 'string',
        description: 'Page title. Accepted for compatibility.',
      },
      theme: {
        type: ['string', 'object'],
        default: 'light',
        description:
          "As a string ('light' or 'dark'), sets the base theme for sider, menu, header, and mobile header. Individual component themes (sider.theme, header.theme, mobileHeader.theme) override this value. As an object, applies Ant Design design token overrides to all child components.",
      },
      logo: {
        type: 'object',
        description: 'Logo settings.',
        additionalProperties: false,
        properties: {
          src: {
            type: 'string',
            description: 'Logo source url.',
          },
          srcMobile: {
            type: 'string',
            description: 'Mobile logo source url.',
          },
          alt: {
            type: 'string',
            default: 'Lowdefy',
            description: 'Logo alternative text.',
          },
          style: {
            type: 'object',
            description: 'Css style object to apply to logo.',
            docs: {
              displayType: 'yaml',
            },
          },
        },
      },
      sider: {
        type: 'object',
        description: 'Sider properties.',
        additionalProperties: false,
        properties: {
          collapsedWidth: {
            type: 'integer',
            description:
              'Width of the collapsed sidebar, by setting to 0 a special trigger will appear.',
          },
          collapsible: {
            type: 'boolean',
            default: true,
            description: 'Whether can be collapsed.',
          },
          initialCollapsed: {
            type: 'boolean',
            default: false,
            description: 'Set the initial collapsed state.',
          },
          theme: {
            type: 'string',
            enum: ['light', 'dark'],
            default: 'light',
            description: 'Color theme of the sidebar.',
          },
          style: {
            type: 'object',
            description: 'Css style object to apply to sider.',
            docs: {
              displayType: 'yaml',
            },
          },
          width: {
            type: ['string', 'number'],
            default: 'string',
            description: 'Width of the sidebar.',
            docs: {
              displayType: 'string',
            },
          },
          hideToggleButton: {
            type: 'boolean',
            description: 'Hide toggle button in sider.',
            default: false,
          },
        },
      },
      siderStorageKey: {
        type: 'string',
        default: 'sider',
        description:
          "localStorage key suffix for sider state persistence. Produces key 'lf-{siderStorageKey}-open'.",
      },
      header: {
        type: 'object',
        description: 'Header properties.',
        additionalProperties: false,
        properties: {
          theme: {
            type: 'string',
            enum: ['light', 'dark'],
            description: 'Header theme color.',
          },
          contentStyle: {
            type: 'object',
            description: 'Header content css style object.',
            docs: {
              displayType: 'yaml',
            },
          },
          style: {
            type: 'object',
            description: 'Header css style object.',
            docs: {
              displayType: 'yaml',
            },
          },
        },
      },
      mobileHeader: {
        type: 'object',
        description: 'Mobile header properties.',
        additionalProperties: false,
        properties: {
          theme: {
            type: 'string',
            enum: ['light', 'dark'],
            default: 'light',
            description: 'Mobile header theme color.',
          },
        },
      },
      toggleSiderButton: {
        type: 'object',
        description: 'Toggle sider button properties.',
        docs: {
          displayType: 'button',
        },
      },
      footer: {
        type: 'object',
        description: 'Footer properties.',
        additionalProperties: false,
        properties: {
          style: {
            type: 'object',
            description: 'Footer css style object.',
            docs: {
              displayType: 'yaml',
            },
          },
        },
      },
      content: {
        type: 'object',
        description: 'Content properties.',
        additionalProperties: false,
        properties: {
          style: {
            type: 'object',
            description: 'Content css style object.',
            docs: {
              displayType: 'yaml',
            },
          },
        },
      },
      breadcrumb: {
        type: 'object',
        description: 'Breadcrumb properties.',
        properties: {
          separator: {
            type: 'string',
            default: '/',
            description: 'Use a custom separator string.',
          },
          list: {
            type: 'array',
            description: 'List of breadcrumb links.',
            items: {
              type: 'string',
              description: 'Title of the breadcrumb link.',
            },
          },
        },
      },
      menu: {
        type: 'object',
        description: 'Menu properties.',
        properties: {
          theme: {
            type: 'string',
            enum: ['dark', 'light'],
            default: 'light',
            description: 'Color theme of menu.',
          },
          defaultOpenKeys: {
            type: 'array',
            description: 'Array of initially opened submenu keys.',
            items: {
              type: 'string',
              description: 'Submenu key.',
            },
          },
          links: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'type'],
              properties: {
                id: {
                  type: 'string',
                  description: 'Menu item id.',
                },
                pageId: {
                  type: 'string',
                  description: 'Page to link to.',
                },
                properties: {
                  type: 'object',
                  description: 'properties from menu item.',
                  properties: {
                    title: {
                      type: 'string',
                      description: 'Menu item title.',
                    },
                    icon: {
                      type: ['string', 'object'],
                      description:
                        "Name of an React-Icon (See <a href='https://react-icons.github.io/react-icons/'>all icons</a>) or properties of an Icon block to customize icon on menu item.",
                      docs: {
                        displayType: 'icon',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      menuLg: {
        type: 'object',
        description:
          'Menu large screen properties. Overwrites menu properties on desktop screen sizes.',
        docs: {
          displayType: 'yaml',
        },
      },
      menuMd: {
        type: 'object',
        description: 'Mobile menu properties. Overwrites menu properties on mobile screen sizes.',
        docs: {
          displayType: 'yaml',
        },
      },
    },
  },
};
