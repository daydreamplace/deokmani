import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';
import styled from 'styled-components';
import WishList from '../../components/WishList';

const Keyword = () => {
  const navigate = useNavigate();
  const keyword = new URLSearchParams(location.search).get('keyword');
  const indexNum = Number(new URLSearchParams(location.search).get('index'));
  const [keywordRank, setKeywordRank] = useState([]);
  const [keywordList, setKeywordList] = useState([]);
  const [page, setPage] = useState(1);
  const [indexArr, setIndexArr] = useState([1, indexNum, 3]);
  const [keywordArr, setKeywordArr] = useState(['', '', '']);

  useEffect(() => {
    getKeywordRank();
    getKeywordList();
    if (indexNum === 0) {
      setIndexArr([keywordRank.length - 1, indexNum, indexNum + 1]);
    } else if (indexNum === keywordRank.length - 1) {
      setIndexArr([indexNum - 1, indexNum, 0]);
    } else setIndexArr([indexNum - 1, indexNum, indexNum + 1]);
  }, [keyword]);
  useEffect(() => {
    if (keywordRank.length) {
      let arr = [];
      if (indexArr[0] === -1) indexArr[0] = keywordRank.length - 1;
      else if (indexArr[2] === keywordRank.length) indexArr[2] = 0;
      for (let i = 0; i < 3; i++) {
        arr.push(keywordRank[indexArr[i]].keyword);
      }
      setKeywordArr(arr);
    }
  }, [keywordRank]);

  const getKeywordRank = async () => {
    try {
      const { data } = await api.get(`keyword`);
      setKeywordRank(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getKeywordList = async () => {
    const uuid = localStorage.getItem('uuid');
    try {
      const { data } = await api.get(`search?keyword=${keyword}&skip=1&limit=10&uuid=${uuid}`);
      setKeywordList(data);
      setPage(1);
    } catch (error) {
      console.log(error);
    }
  };

  const getNextKeywordList = idx => {
    if (idx === 0) {
      navigate(`/search?index=${indexArr[0]}&keyword=${keywordArr[0]}`);
    } else if (idx === 2) {
      navigate(`/search?index=${indexArr[2]}&keyword=${keywordArr[2]}`);
    }
  };

  return (
    <KeywordContainer>
      <WishList //
        title='인기 키워드'
        wishList={keywordList}
        setWishList={setKeywordList}
        keyword={keyword}
        next={getNextKeywordList}
        page={page}
        setPage={setPage}
        indexArr={indexArr}
        keywordArr={keywordArr}
      />
    </KeywordContainer>
  );
};

const KeywordContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.bgColor};
`;

export default Keyword;
