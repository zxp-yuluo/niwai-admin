import niwai from './niwai'

// 登录
export const login = data => niwai.post('/login', data);

// 根据用户名获取用户歌单
export const getUserSheetByUsername = username => niwai.get('/sheets/' + username);

// 创建歌单
export const establishUserSheet = data => niwai.post('/sheets', data);

// 根据id修改歌单
export const updateUserSheet = (id, data) => niwai.put('/sheets/' + id, data);

// 根据id删除歌单
export const delUserSheet = id => niwai.delete('/sheets/' + id);

// 根据名字删除图片
export const delPictureByName = name => niwai.delete('/upload/picture/' + name);

// 根据名字删除音频
export const delAudioByName = name => niwai.delete('/upload/audio/' + name);

// 根据名字删除歌词
export const delLyricsByName = name => niwai.delete('/upload/lyrics/' + name);

// 添加歌曲
export const addUserSong = data => niwai.post('/songs',data);

//  根据id删除歌曲
export const delSongById = id => niwai.delete('/songs/' + id);

//  根据id修改歌曲
export const updateSongById = (id, data) => niwai.put('/songs/' + id, data);

// 根据搜索关键字获取用户歌曲
export const getUserSongBySearch = (keywordType, keyword, create_author, pageNum, pageSize) => niwai.get(
  '/songs/search/' + keywordType + '/' + keyword + '/' + create_author + '/' + pageNum + '/' + pageSize
);

// 获取用户信息
export const getUserInfo = () => niwai.get('/users');
