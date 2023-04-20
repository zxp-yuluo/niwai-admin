import React from 'react';
const Index = (props) => {
  return (
    <div className='body_index_list'>
      <div className='body_index_item'>
        <div className='body_item_left'>
          <h5>青钢影·卡蜜尔</h5>
          <p>优雅永不过时</p>
          <p>合适的话语胜过锋利的刀子</p>
          <p>悔恨会磨平我们灵魂中的棱角</p>
          <p>人人有自己的位置，忘乎所以，就危险了</p>
        </div>
        <div className='body_item_right'>
          <img src="http://localhost:5000/image/kme.jpg" alt="" />
        </div>
      </div>
      <div className='body_index_item'>
        <div className='body_item_right'>
          <img src="http://localhost:5000/image/j.jpg" alt="" />
        </div>
        <div className='body_item_left'>
          <h5>戏命师·烬</h5>
          <p>只愿你曾被这世界温柔相待。</p>
          <p>我很想知道他们看到我时，会怎么想。</p>
          <p>我于杀戮之中盛放，一如黎明中的花朵。</p>
          <p>我在每场演出前都会紧张，但那种感觉不可或缺。</p>
        </div>
      </div>
    </div>
  )
}

export default Index