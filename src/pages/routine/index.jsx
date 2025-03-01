import React, { useState } from 'react';
import { Button, Modal, Mentions } from 'antd';

import CommentSection from '@/components/comment/CommentSection';

const TaskCommentsModal = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'John Doe',
      content: 'This is a comment about the task.',
      date: '2025-03-01 10:00 AM',
    },
    {
      id: 2,
      author: 'Jane Smith',
      content: 'I have some updates on this task. Please review.',
      date: '2025-03-02 11:00 AM',
    },
    {
      id: 3,
      author: 'Michael Johnson',
      content: 'I will be working on this task tomorrow.',
      date: '2025-03-03 09:30 AM',
    },
    {
      id: 4,
      author: 'Sarah Williams',
      content: 'This task is progressing well, everything looks good.',
      date: '2025-03-04 01:45 PM',
    },
    {
      id: 5,
      author: 'David Lee',
      content: 'The task is on hold for now due to some blockers.',
      date: '2025-03-05 03:00 PM',
    },
  ]);

  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);

  const [newComment, setNewComment] = useState('');

  const handleNewComment = (comment) => {
    setComments([
      ...comments,
      {
        id: comments.length + 1,
        author: 'Current User',
        content: comment,
        date: new Date().toLocaleString(),
      },
    ]);
    setNewComment('');
  };

  const onCommentChange = (value) => {
    setNewComment(value);
  };

  const showCommentModal = () => {
    setIsCommentModalVisible(true);
  };

  const hideCommentModal = () => {
    setIsCommentModalVisible(false);
  };

  return (
    <div>
      <Button type="primary" onClick={showCommentModal}>
        View Task Comments
      </Button>

      {/* Modal with the comments */}
      <Modal
        title="Task Comments"
        open={isCommentModalVisible}
        onCancel={hideCommentModal}
        footer={null}
        style={{ top: 20 }}
      >
        <div
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
            paddingBottom: '80px',
          }}
        >
          <CommentSection comments={comments} />
        </div>

        {/* Fixed Mention box and Submit Button */}
        <div
          style={{
            bottom: '0',
            width: '100%',
            background: 'white',
            padding: '16px',
          }}
        >
          <Mentions
            value={newComment}
            onChange={onCommentChange}
            placeholder="Add your comment"
            style={{
              width: '100%',
              marginBottom: '8px',
              minHeight: '80px',
            }}
            suggestions={[
              { label: '@John Doe', value: 'John Doe' },
              { label: '@Jane Smith', value: 'Jane Smith' },
              { label: '@Michael Johnson', value: 'Michael Johnson' },
            ]}
          />
          <Button
            type="primary"
            block
            onClick={() => handleNewComment(newComment)}
            disabled={!newComment.trim()}
          >
            Submit Comment
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TaskCommentsModal;
