import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';
import styled from 'styled-components';
import { BsArrowCounterclockwise } from 'react-icons/bs';
import useStore from '../../context/store';
import MakeWishModal from '../../components/MakeWishModal';
import CreatedModal from '../../components/CreatedModal';
import ReadWishModal from '../../components/ReadWishModal';
import LimitModal from '../../components/LimitModal';
import MainBackground from '../../components/MainBackground';
import TopKeyword from '../../components/TopKeyword';
import MenuButton from '../../components/MenuButton';
import SideBar from '../../components/SideBar';
import { HomeContainer } from '../Intro';
import onePocket from '../../assets/main/pockets/shadow.png';
import wishText from '../../assets/main/pockets/wish-text.png';
import { imgArr } from '../../constant/bok';
import { bell } from '../../utils/Animation';
import { contentFontColor, headercolor, HomeButtonFont, redButton, wishButton } from '../../theme';

const Home = () => {
  const navigate = useNavigate();
  const [pocketCounts, setPocketCounts] = useState(0);
  const [wroteWish, setWroteWish] = useState([]);
  const [wishId, setWishId] = useState();
  const [wishCheck, setWishCheck] = useState('');
  const [otherWish, setOtherWish] = useState([]);
  const [isMakeWish, setIsMakeWish] = useState(false);
  const [isCreatedModal, setIsCreatedModal] = useState(false);
  const [isReadWish, setIsReadWish] = useState(false);
  const [isLimitModal, setIsLimitModal] = useState(false);
  const [isSideBar, setIsSideBar] = useState(false);
  const [keywords, setKeywords] = useState();
  const { falseIntroPass } = useStore();
  let uuid = localStorage.getItem('uuid');

  useEffect(() => {
    falseIntroPass();
    getWish();
    getKeywords();
  }, []);

  useEffect(() => {
    getWishCheck();
    getWishCounts();
    if (wroteWish.length <= 7) getWish();
  }, [isMakeWish]);

  const getWish = async () => {
    try {
      const { data } = await api.get('main');
      setWroteWish(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getWishCheck = async () => {
    try {
      const {
        data: { message },
      } = await api.get(`wish-check?uuid=${uuid}`);
      setWishCheck(message);
    } catch (error) {
      setWishCheck(error.response.data);
    }
  };

  const getWishCounts = async () => {
    try {
      const {
        data: { wishes },
      } = await api.get('wish-count');
      setPocketCounts(wishes);
    } catch (error) {
      console.log(error);
    }
  };

  const makeWish = () => {
    if (uuid) {
      if (wishCheck === 'Nothing Duplication') setIsMakeWish(true);
      else setIsLimitModal(true);
    } else {
      if (confirm('잘못된 접근입니다. 새로고침 후 다시 시도해주세요')) location.reload();
    }
  };

  const getKeywords = async () => {
    try {
      const { data } = await api.get(`keyword`);
      setKeywords(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <HomeContainer>
      <HomeArticle>
        <div className='home-header'>
          <div>
            <div className='font-box'>
              <h2 className='header-color'>{pocketCounts.toLocaleString()}</h2>
              <h2>개의</h2>
            </div>
            <h2>소원이 달렸어요</h2>
          </div>
        </div>
        <div className='home-body'>
          <div className='column wish-btn' onClick={makeWish}>
            <img src={onePocket} />
            <img className='text' src={wishText} />
          </div>
          {wroteWish.map((wish, index) => {
            const randomNumber = Math.floor(Math.random() * 8) + 1;
            const other = wroteWish.filter(el => el._id !== wish._id);
            return (
              <div
                className='column'
                key={`${index}${wish._id}`}
                onClick={() => {
                  setWishId(wish._id);
                  setIsReadWish(true);
                  setOtherWish(other);
                }}
              >
                <img src={imgArr[randomNumber]} />
                <p className='wish-num'>{wish.likes}</p>
              </div>
            );
          })}
        </div>
        <div className='home-bottom'>
          <TopKeyword data={keywords} />
          <Button home onClick={() => getWish()}>
            <BsArrowCounterclockwise size='1.4rem' />
            <button>다른 소원들 보기</button>
          </Button>
        </div>
        <SideBar isSideBar={isSideBar} wishCheck={wishCheck} />
        <MenuButton isSideBar={isSideBar} setIsSideBar={setIsSideBar} />
        <Blur isSideBar={isSideBar} onClick={() => setIsSideBar(false)} />
      </HomeArticle>
      <MainBackground />
      {isMakeWish && <MakeWishModal setIsMakeWish={setIsMakeWish} setIsCreatedModal={setIsCreatedModal} />}
      {isCreatedModal && <CreatedModal setIsCreatedModal={setIsCreatedModal} />}
      {isReadWish && <ReadWishModal id={wishId} setIsReadWish={setIsReadWish} otherWish={otherWish} wroteWish={wroteWish} setWroteWish={setWroteWish} />}
      {isLimitModal && <LimitModal isLimitModal={isLimitModal} setIsLimitModal={setIsLimitModal} />}
    </HomeContainer>
  );
};

const HomeArticle = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3.5rem 1rem;
  width: 100%;
  max-width: 440px;
  height: 100vh;
  min-height: 700px;
  max-height: 1100px;
  background-color: inherit;
  overflow-x: hidden;
  z-index: 2;
  ${HomeButtonFont};
  font-family: 'CWDangamAsac-Bold';
  color: ${contentFontColor};
  .home-header {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding-left: 5%;
    .font-box {
      display: flex;
      padding-bottom: 7px;
      .header-color {
        color: ${headercolor};
        margin-right: 6px;
      }
    }
    h2 {
      font-size: 2.3rem;
      color: ${contentFontColor};
    }
  }
  .home-body {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    @media screen and (min-height: 810px) {
      margin-bottom: 20px;
    }
    @media screen and (min-height: 900px) {
      margin-bottom: 40px;
    }
    .text {
      position: absolute;
      top: -1.5rem;
      left: 0.4rem;
    }
    .column {
      position: relative;
      margin: 0 auto;
      width: 30%;
      text-align: center;
    }
    img {
      margin: 1rem;
      width: 75px;
      cursor: pointer;
      @media screen and (min-height: 810px) {
        margin: 1.6rem 1rem;
      }
      @media screen and (min-height: 900px) {
        margin: 2.4rem 1rem;
      }
    }
    .wish-btn {
      transform-origin: center;
      animation: ${bell} 2s infinite linear;
    }
    .wish-num {
      position: absolute;
      bottom: 24%;
      left: 54%;
      @media screen and (min-height: 810px) {
        bottom: 27%;
      }
      font-family: 'Pretendard';
      font-weight: 800;
      font-size: 1.4rem;
      color: ${redButton};
    }
  }
`;

export const Button = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  padding: 2px;
  margin: 0 auto;
  width: 90%;
  border-radius: 17px;
  box-shadow: ${props => (props.home ? 'none' : 'rgba(0, 0, 0, 0.3) 3px 3px 3px')};
  background-color: ${wishButton};
  color: #fff;
  cursor: pointer;
  button {
    padding: 1rem;
    outline: none;
    border: none;
    font-family: 'Pretendard';
    background-color: inherit;
    font-size: 1.3rem;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
  }
`;

export const Blur = styled.div`
  display: flex;
  justify-content: flex-end;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  visibility: ${({ isSideBar }) => (isSideBar ? 'visible' : 'hidden')};
  transition: 0.3s;
  z-index: 2;
`;

export default Home;
