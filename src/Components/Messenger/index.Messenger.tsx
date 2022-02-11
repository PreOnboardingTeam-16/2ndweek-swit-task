import * as S from 'Components/Messenger/style.Messenger';
import React, { useEffect, useState,useRef } from 'react';
import Chat from 'Components/Messenger/Chat/index.Chat';
import { useSelector } from 'react-redux';
import { messageJson } from 'Components/Messenger/data';
import { MockDataType, userState } from 'src/Types/type';
import { RootState } from 'src/Redux/index.Redux';
import Input from 'Components/Messenger/Input/index.Input';
import Header from 'Components/Header/index.Header';

const Messenger = (): JSX.Element => {
  const user:userState = useSelector((state: RootState) => state.user);
  let messageJsonCopy = JSON.parse(JSON.stringify(messageJson));
  const [ChatListData, setChatListData] = useState<MockDataType[]>(messageJsonCopy);
  const [reply, setReply] = useState<string>('');
  const chatRoom = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let tmpData: MockDataType[] = [...ChatListData];
    if (user.isLogin) {
      console.log('로그인');
      tmpData.map(el => {
        if (el.userId === user.userId) {
          return (el.userName = user.userName);
        } else return null;
      });
      setChatListData(tmpData);
    } else {
      console.log('로그아웃');
      let messageJsonReset = JSON.parse(JSON.stringify(messageJson));
      setChatListData(messageJsonReset);
    }
  }, [user.isLogin]);

  useEffect(()=>{
    if(chatRoom.current){
      chatRoom.current.scrollTop = chatRoom.current.scrollHeight
    }
  },[ChatListData])

  const onDeleteEvent = (index: number): boolean => {
    let messageTmp = ChatListData[index].content;
    console.log(messageTmp.length);
    if (messageTmp.length > 10) {
      messageTmp = messageTmp.substring(0, 10) + '...';
    }
    let isConfirm = window.confirm(`${messageTmp} 메시지를 삭제하겠습니까?`);
    return isConfirm;
  };
  const onDelete = (index: number): void => {
    let isConfirm = onDeleteEvent(index);
    if (isConfirm === true) {
      let tmpData: MockDataType[] = [...ChatListData];
      tmpData[index].isDel = true;
      setChatListData(tmpData);
    }
  };
  return (
    <S.MessengerContainer>
      <Header />
      <S.BoxShadowWarpper>
        <S.ChatList ref={chatRoom}>
          {ChatListData &&
            ChatListData.map((el: MockDataType, index: number) => {
              return (
                <S.Message
                  key={index}
                  userId={el.userId}
                  loginUser={user.userId}
                >
                  <Chat
                    data={el}
                    setReply={setReply}
                    index={index}
                    onDelete={onDelete}
                  />
                </S.Message>
              );
            })}
        </S.ChatList>
      </S.BoxShadowWarpper>
      <Input reply={reply} setReply={setReply}  ChatListData = {ChatListData} setChatListData = {setChatListData}/>
    </S.MessengerContainer>
  );
};

export default Messenger;
