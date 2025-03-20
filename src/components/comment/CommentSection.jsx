import React, { useState } from 'react';
import { Avatar, Space, Card, Typography } from 'antd';
import { User, ThumbsUp, Heart, Smile } from 'lucide-react';
import moment from 'moment';

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

      {comments.length > 0 ? (
        comments.map((comment) => (
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
                    size={22}
                  />
                ) : (
                  <ThumbsUp
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleReactionClick(comment.id, 'like')}
                    size={20}
                  />
                )}
                {/* Heart reaction */}
                {reactions[comment.id] === 'heart' ? (
                  <Heart
                    style={{ fill: 'red', color: 'red', cursor: 'pointer' }}
                    onClick={() => handleReactionClick(comment.id, 'heart')}
                    size={22}
                  />
                ) : (
                  <Heart
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleReactionClick(comment.id, 'heart')}
                    size={20}
                  />
                )}
                {/* Smile reaction */}
                {reactions[comment.id] === 'smile' ? (
                  <Smile
                    style={{ fill: 'green', color: 'white', cursor: 'pointer' }}
                    onClick={() => handleReactionClick(comment.id, 'smile')}
                    size={22}
                  />
                ) : (
                  <Smile
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleReactionClick(comment.id, 'smile')}
                    size={20}
                  />
                )}
              </Space>,
            ]}
          >
            <Space style={{ width: '100%' }} align="baseline">
              <Avatar src={comment?.avatar} style={{ marginRight: 8 }}>
                {!comment?.avatar && `${comment?.user?.firstName[0]}`}{' '}
              </Avatar>
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Space
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  <strong>{comment?.user.fullName}</strong>
                  <Text
                    type="secondary"
                    style={{ fontSize: '12px', alignSelf: 'flex-end' }}
                  >
                    {moment(comment?.createdAt).format('DD MMM YYYY, h:mm a')}
                  </Text>
                </Space>
              </Space>
            </Space>
            <Space className="mt-0 ml-12 ">
              <p>{comment.comment}</p>
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
