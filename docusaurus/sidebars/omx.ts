import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/*
 * The OMX menu has no parts that fold.
 *
 * - A title, such as "Quick Start Guide", is a group that does not fold and is not a link
 *   (`collapsible: false`, class `sidebar-title`).
 * - A row that holds more pages, such as "Cyclo Intelligence", opens its own page, and that page links to them.
 *   The pages stay in the menu but are hidden (class `sidebar-row`). So they still show this menu,
 *   the place line above their title and Previous / Next, and their row stays marked while one of them is open.
 *
 * Both classes are styled in src/css/custom.css.
 */
const omxSidebar: SidebarsConfig[string] = [
  {
    type: 'category',
    label: 'About OMX',
    collapsible: false,
    className: 'sidebar-title',
    items: [
      {type: 'doc', id: 'systems/omx/introduction', label: 'Introduction'},
      {type: 'doc', id: 'systems/omx/video_gallery', label: 'Video Gallery'},
      {type: 'doc', id: 'systems/omx/specifications/hardware', label: 'Hardware Specifications'},
      {
        // The Software page explains Zenoh at its top and links to this page for the rest.
        type: 'category',
        label: 'Software Specifications',
        link: {type: 'doc', id: 'systems/omx/specifications/software'},
        collapsible: false,
        className: 'sidebar-row',
        items: [{type: 'doc', id: 'systems/omx/specifications/zenoh_communication', label: 'Zenoh Communication'}],
      },
      {type: 'doc', id: 'systems/omx/resources/open_source', label: 'Open Source'},
    ],
  },
  {
    type: 'category',
    label: 'Quick Start Guide',
    collapsible: false,
    className: 'sidebar-title',
    items: [
      {type: 'doc', id: 'systems/omx/quick_start_guide/assembly_guide', label: 'Assemble OMX'},
      {
        // The pages inside do what Move OMX does, in the way the rest of the docs do it.
        // Move OMX links to them. Its Next goes to Train and run AI (set in its front matter).
        type: 'category',
        label: 'Move OMX',
        link: {type: 'doc', id: 'systems/omx/quick_start_guide/move_omx'},
        collapsible: false,
        className: 'sidebar-row',
        items: [
          {type: 'doc', id: 'systems/omx/quick_start_guide/setup_guide/setup_guide', label: 'Setup Guide'},
          {type: 'doc', id: 'systems/omx/quick_start_guide/setup_guide/ros2_setup', label: 'ROS 2 Setup'},
          {type: 'doc', id: 'systems/omx/quick_start_guide/operation_guide', label: 'Operation Guide'},
          {type: 'doc', id: 'systems/omx/quick_start_guide/operation_guide/teleoperation', label: 'Teleoperation'},
        ],
      },
      // Keep these in the same order as the pages in quick_start_guide/_quick_start.ts.
      {type: 'doc', id: 'systems/omx/quick_start_guide/train_and_run_ai', label: 'Train and run AI'},
    ],
  },
  {
    type: 'category',
    label: 'Imitation Learning',
    collapsible: false,
    className: 'sidebar-title',
    items: [
      {
        type: 'category',
        label: 'Cyclo Intelligence',
        link: {type: 'doc', id: 'systems/omx/imitation_learning/imitation_learning'},
        collapsible: false,
        className: 'sidebar-row',
        items: [
          {type: 'doc', id: 'systems/omx/imitation_learning/setup', label: 'Setup', key: 'cyclo-intelligence-setup'},
          {type: 'doc', id: 'systems/omx/imitation_learning/data_recording', label: 'Data Recording', key: 'cyclo-intelligence-data-recording'},
          {type: 'doc', id: 'systems/omx/imitation_learning/data_tools', label: 'Data Tools', key: 'cyclo-intelligence-data-tools'},
          {type: 'doc', id: 'systems/omx/imitation_learning/model_training', label: 'Model Training Guide', key: 'cyclo-intelligence-model-training'},
          {type: 'doc', id: 'systems/omx/imitation_learning/model_inference', label: 'Model Inference', key: 'cyclo-intelligence-model-inference'},
          {type: 'doc', id: 'systems/omx/imitation_learning/overview', label: 'Imitation Learning Overview', key: 'imitation-learning-overview'},
          {type: 'doc', id: 'systems/omx/resources/legacy/physical_ai_tools/imitation_learning', label: 'Physical AI Tools (Legacy)', key: 'physical-ai-tools'},
          {type: 'doc', id: 'systems/omx/resources/legacy/physical_ai_tools/setup_guide', label: 'Setup Guide', key: 'physical-ai-tools-setup-guide'},
          {type: 'doc', id: 'systems/omx/resources/legacy/physical_ai_tools/dataset_preparation/dataset_preparation', label: 'Dataset Preparation', key: 'physical-ai-tools-dataset-preparation'},
          {type: 'doc', id: 'systems/omx/resources/legacy/physical_ai_tools/dataset_preparation/prerequisites', label: 'Prerequisites', key: 'physical-ai-tools-prerequisites'},
          {type: 'doc', id: 'systems/omx/resources/legacy/physical_ai_tools/dataset_preparation/recording', label: 'Recording', key: 'physical-ai-tools-recording'},
          {type: 'doc', id: 'systems/omx/resources/legacy/physical_ai_tools/dataset_preparation/visualization', label: 'Visualization', key: 'physical-ai-tools-visualization'},
          {type: 'doc', id: 'systems/omx/resources/legacy/physical_ai_tools/model_training', label: 'Model Training', key: 'physical-ai-tools-model-training'},
          {type: 'doc', id: 'systems/omx/resources/legacy/physical_ai_tools/model_inference', label: 'Model Inference', key: 'physical-ai-tools-model-inference'},
          {type: 'doc', id: 'systems/omx/resources/legacy/physical_ai_tools/data_tools', label: 'Data Tools', key: 'physical-ai-tools-data-tools'},
        ],
      },
    ],
  },
  {
    // Each row finishes the title as a sentence: "Control OMX with MoveIt 2, GUI or Keyboard".
    type: 'category',
    label: 'Control OMX',
    collapsible: false,
    className: 'sidebar-title',
    items: [
      {type: 'doc', id: 'systems/omx/quick_start_guide/operation_guide/robot_control', label: 'With MoveIt 2, GUI or Keyboard'},
      {
        type: 'category',
        label: 'By Target Pose (Cyclo Control)',
        link: {type: 'doc', id: 'systems/omx/advanced_features/cyclo_control'},
        collapsible: false,
        className: 'sidebar-row',
        items: [
          {type: 'doc', id: 'systems/omx/advanced_features/advanced_features', label: 'Advanced Features', key: 'advanced-features-overview'},
        ],
      },
      {
        type: 'category',
        label: 'From a Browser (Cyclo Manager)',
        link: {type: 'doc', id: 'systems/omx/quick_start_guide/operation_guide/cyclo_manager/cyclo_manager'},
        collapsible: false,
        className: 'sidebar-row',
        items: [
          {type: 'doc', id: 'systems/omx/quick_start_guide/operation_guide/cyclo_manager/install', label: 'Install'},
          {type: 'doc', id: 'systems/omx/quick_start_guide/operation_guide/cyclo_manager/bringup', label: 'Bringup'},
          {type: 'doc', id: 'systems/omx/quick_start_guide/operation_guide/cyclo_manager/manage_container', label: 'Manage Containers'},
          {type: 'doc', id: 'systems/omx/quick_start_guide/operation_guide/cyclo_manager/version_update', label: 'Version Update'},
          {type: 'doc', id: 'systems/omx/quick_start_guide/operation_guide/cyclo_manager/novnc', label: 'noVNC'},
        ],
      },
      {
        type: 'category',
        label: 'In a Simulator',
        link: {type: 'doc', id: 'systems/omx/simulation/simulation'},
        collapsible: false,
        className: 'sidebar-row',
        items: [{type: 'doc', id: 'systems/omx/simulation/gazebo', label: 'Gazebo'}],
      },
    ],
  },
  {
    type: 'category',
    label: 'Help',
    collapsible: false,
    className: 'sidebar-title',
    items: [
      // The FAQ and the release notes are on Discord. Their pages only link there.
      {type: 'link', label: 'Discord', href: 'https://discord.gg/robotis'},
      {type: 'doc', id: 'systems/omx/support/issues', label: 'Issues'},
      {type: 'doc', id: 'systems/omx/support/contact_us', label: 'Contact Us'},
    ],
  },
];

export default omxSidebar;
