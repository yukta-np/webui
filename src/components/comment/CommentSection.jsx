import React, { useState } from 'react';
import { Avatar, Space, Card, Typography } from 'antd';
import { User, ThumbsUp, Heart, Smile } from 'lucide-react';

const { Text } = Typography;

const CommentSection = ({ comments }) => {
  const [reactions, setReactions] = useState({});

  const handleReactionClick = (commentId, reactionType) => {
    setReactions((prevState) => ({
      ...prevState,
      [commentId]: reactionType,
    }));
  };

  return (
    <div>
      {/* Render existing comments */}
      {comments.map((comment) => (
        <Card
          key={comment.id}
          style={{ marginBottom: '16px' }}
          actions={[
            <Space key="reactions">
              {/* Like reaction */}
              {reactions[comment.id] === 'like' ? (
                <ThumbsUp
                  style={{ fill: 'blue', color: 'blue', cursor: 'pointer' }}
                  onClick={() => handleReactionClick(comment.id, 'like')}
                />
              ) : (
                <ThumbsUp
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleReactionClick(comment.id, 'like')}
                />
              )}
              {/* Heart reaction */}
              {reactions[comment.id] === 'heart' ? (
                <Heart
                  style={{ fill: 'red', color: 'red', cursor: 'pointer' }}
                  onClick={() => handleReactionClick(comment.id, 'heart')}
                />
              ) : (
                <Heart
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleReactionClick(comment.id, 'heart')}
                />
              )}
              {/* Smile reaction */}
              {reactions[comment.id] === 'smile' ? (
                <Smile
                  style={{ fill: 'yellwo', color: 'yellow', cursor: 'pointer' }}
                  onClick={() => handleReactionClick(comment.id, 'smile')}
                />
              ) : (
                <Smile
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleReactionClick(comment.id, 'smile')}
                />
              )}
            </Space>,
          ]}
        >
          <Space style={{ width: '100%' }} align="baseline">
            <Avatar icon={<User />} />
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <strong>{comment.author}</strong>
                <Text
                  type="secondary"
                  style={{ fontSize: '12px', alignSelf: 'flex-end' }}
                >
                  {comment.date}
                </Text>
              </Space>
            </Space>
          </Space>

          <p>{comment.content}</p>
        </Card>
      ))}
    </div>
  );
};

export default CommentSection;
