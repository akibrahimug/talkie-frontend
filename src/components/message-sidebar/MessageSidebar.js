import doubleCheckmark from '@assets/images/double-checkmark.png';
import Avatar from '@components/avatar/Avatar';
import PropTypes from 'prop-types';
import { FaCheck, FaCircle } from 'react-icons/fa';

import '@components/message-sidebar/MessageSidebar.scss';
import { Utils } from '@services/utils/utils.service';

const MessageSidebar = ({ profile, messageCount, messageNotifications, openChatPage }) => {
  return (
    <div className="social-dropdown" data-testid="message-sidebar">
      <div className="social-card">
        <div className="social-card-body">
          <div className="social-bg-primary">
            <h5>
              Messages
              {messageCount > 0 && <span className="social-count">{messageCount}</span>}
            </h5>
          </div>

          <div className="social-card-body-info">
            <div data-testid="info-container" className="social-card-body-info-container">
              {messageNotifications && messageNotifications.length > 0 ? (
                messageNotifications.map((notification) => (
                  <div
                    className="social-sub-card"
                    key={Utils.generateString(10)}
                    onClick={() => openChatPage(notification)}>
                    <div className="content-avatar">
                      <Avatar
                        name={
                          notification.receiverUsername === profile?.username
                            ? profile?.username
                            : notification?.senderUsername
                        }
                        bgColor={
                          notification.receiverUsername === profile?.username
                            ? notification.receiverAvatarColor
                            : notification?.senderAvatarColor
                        }
                        textColor="#ffffff"
                        size={40}
                        avatarSrc={
                          notification.receiverUsername !== profile?.username
                            ? notification.receiverProfilePicture
                            : notification?.senderProfilePicture
                        }
                      />
                    </div>
                    <div className="content-body">
                      <h6 className="title">
                        {notification.receiverUsername !== profile?.username
                          ? notification.receiverUsername
                          : notification.senderUsername}
                      </h6>
                      <p className="subtext">{notification?.body ? notification?.body : notification?.message}</p>
                    </div>
                    <div className="content-icons">
                      {!notification?.isRead ? (
                        <>
                          {notification.receiverUsername === profile?.username ? (
                            <FaCircle className="circle" />
                          ) : (
                            <FaCheck className="circle not-read" />
                          )}
                        </>
                      ) : (
                        <>
                          {notification.senderUsername === profile?.username && (
                            <img src={doubleCheckmark} alt="" className="circle read" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-reactions-found">No messages yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

MessageSidebar.propTypes = {
  profile: PropTypes.object.isRequired,
  messageCount: PropTypes.number.isRequired,
  messageNotifications: PropTypes.array.isRequired,
  openChatPage: PropTypes.func.isRequired
};
export default MessageSidebar;
