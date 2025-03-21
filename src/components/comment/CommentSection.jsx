import React, { useEffect, useState } from 'react';
import { Avatar, Space, Card, Typography, Button, Popconfirm } from 'antd';
import {
  User,
  ThumbsUp,
  Heart,
  Smile,
  FilePenLine,
  Trash2Icon,
} from 'lucide-react';
import moment from 'moment';
import { deleteComment, getComments } from '@/services/tasks.http';

const { Text } = Typography;

const CommentSection = ({ comments, taskId }) => {
  const [reactions, setReactions] = useState({});
  const [comment, setComment] = useState([]);
  useEffect(() => {
    setComment(comments);
  }, [comments]);

  const handleReactionClick = (commentId, reactionType) => {
    setReactions((prevState) => ({
      ...prevState,
      [commentId]: reactionType,
    }));
  };

  const onDeleteClick = async (commentId) => {
    try {
      await deleteComment(taskId, commentId);
      const response = await getComments(taskId);
      setComment(response.data);
    } catch (error) {
      console.log('Error deleting comment:', error);
    }
  };

  return (
    <div>
      {/* Render existing comments */}

      {comment.length > 0 ? (
        comment.map((c) => (
          <Card
            key={c.id}
            style={{ marginBottom: '16px' }}
            actions={[
              <Space key="reactions">
                {/* Like reaction */}
                {reactions[c.id] === 'like' ? (
                  <ThumbsUp
                    style={{ fill: 'blue', color: 'blue', cursor: 'pointer' }}
                    onClick={() => handleReactionClick(c.id, 'like')}
                    size={22}
                  />
                ) : (
                  <ThumbsUp
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleReactionClick(c.id, 'like')}
                    size={20}
                  />
                )}
                {/* Heart reaction */}
                {reactions[c.id] === 'heart' ? (
                  <Heart
                    style={{ fill: 'red', color: 'red', cursor: 'pointer' }}
                    onClick={() => handleReactionClick(c.id, 'heart')}
                    size={22}
                  />
                ) : (
                  <Heart
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleReactionClick(c.id, 'heart')}
                    size={20}
                  />
                )}
                {/* Smile reaction */}
                {reactions[c.id] === 'smile' ? (
                  <Smile
                    style={{ fill: 'green', color: 'white', cursor: 'pointer' }}
                    onClick={() => handleReactionClick(c.id, 'smile')}
                    size={22}
                  />
                ) : (
                  <Smile
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleReactionClick(c.id, 'smile')}
                    size={20}
                  />
                )}
                <Space className="mt-1">
                  <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this comment?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => onDeleteClick(c.id)}
                  >
                    <Button
                      type="link"
                      danger
                      icon={<Trash2Icon stroke="red" size={20} />}
                    />
                  </Popconfirm>
                </Space>
              </Space>,
            ]}
          >
            <Space style={{ width: '100%' }} align="baseline">
              <Avatar src={c?.avatar} style={{ marginRight: 8 }}>
                {!c?.avatar && `${c?.user?.firstName[0]}`}{' '}
              </Avatar>
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Space
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  <strong>{c?.user.fullName}</strong>
                  <Text
                    type="secondary"
                    style={{ fontSize: '12px', alignSelf: 'flex-end' }}
                  >
                    {moment(c?.createdAt).format('DD MMM YYYY, h:mm a')}
                  </Text>
                </Space>
              </Space>
            </Space>
            <Space className="mt-0 ml-12 ">
              <p>{c.comment}</p>
            </Space>
          </Card>
        ))
      ) : (
        <div className="mt-5">
          <p>No comments yet.</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
