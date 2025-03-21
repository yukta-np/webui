import { ResourceActions, Resources } from "@/constants";

export const resources = [
   {
      title: 'Routines',
      namespace: 'Routine',
      name: Resources.routines,
      actions: [
         ResourceActions.create,
         ResourceActions.update,
         ResourceActions.list,
         ResourceActions.view,
         ResourceActions.delete,
         ResourceActions.import,
         ResourceActions.export,
      ],
   },
   {
      title: 'Tasks',
      namespace: 'Task',
      name: Resources.tasks,
      actions: [
         ResourceActions.create,
         ResourceActions.update,
         ResourceActions.list,
         ResourceActions.view,
         ResourceActions.delete,
         ResourceActions.upload,
         ResourceActions.download,
      ],
   },
   {
      title: 'Classroom',
      namespace: 'Classroom',
      name: Resources.classroom,
      actions: [
         ResourceActions.create,
         ResourceActions.update,
         ResourceActions.list,
         ResourceActions.view,
         ResourceActions.delete,
         ResourceActions.import,
         ResourceActions.export,
      ],
   },
   {
      title: 'Calendar',
      namespace: 'Calendar',
      name: Resources.calender,
      actions: [
         ResourceActions.view,
         ResourceActions.update,
         ResourceActions.import,
         ResourceActions.export,
      ],
   },
   {
      title: 'Users',
      namespace: 'User',
      name: Resources.users,
      actions: [
         ResourceActions.create,
         ResourceActions.update,
         ResourceActions.list,
         ResourceActions.view,
         ResourceActions.delete,
         ResourceActions.restore,
      ],
   },
   {
      title: 'Announcements',
      namespace: 'Announcement',
      name: Resources.announcments,
      actions: [
         ResourceActions.create,
         ResourceActions.update,
         ResourceActions.list,
         ResourceActions.view,
         ResourceActions.delete,
         ResourceActions.publish,
      ],
   },
   {
      title: 'Leave Requests',
      namespace: 'LeaveRequest',
      name: Resources.leaveRequest,
      actions: [
         ResourceActions.create,
         ResourceActions.update,
         ResourceActions.list,
         ResourceActions.view,
         ResourceActions.delete,
         ResourceActions.cancel,
      ],
   },
  
   {
      title: 'Notifications',
      namespace: 'Notification',
      name: Resources.notification,
      actions: [
         ResourceActions.list,
         ResourceActions.view,
         ResourceActions.delete,
         ResourceActions.acknowledegedByList,
      ],
   },


   {
      title: 'Permission Groups',
      namespace: 'PermissionGroup',
      name: Resources.permissionGroups,
      actions: [
         ResourceActions.create,
         ResourceActions.update,
         ResourceActions.list,
         ResourceActions.view,
         ResourceActions.delete,
      ],
   },
   {
      title: 'Task Types',
      namespace: 'TaskType',
      name: Resources.taskTypes,
      actions: [
         ResourceActions.create,
         ResourceActions.update,
         ResourceActions.list,
         ResourceActions.view,
         ResourceActions.delete,
      ],
   },
   {
      title: 'Leave Types',
      namespace: 'LeaveType',
      name: Resources.leaveTypes,
      actions: [
         ResourceActions.create,
         ResourceActions.update,
         ResourceActions.list,
         ResourceActions.view,
         ResourceActions.delete,
      ],
   },

   {
      title: 'Settings',
      namespace: 'Setting',
      name: Resources.settings,
      actions: [
         ResourceActions.update,
         ResourceActions.view,
      ],
   },
];
