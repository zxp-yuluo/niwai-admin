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

// 获取角色列表
export const getRoleList = () => niwai.get('/roles');

// 添加角色
export const addRole = data => niwai.post('/roles', data);

// 角色授权
export const roleAuth = (id,data) => niwai.put('/roles/' + id, data);

// 获取用户列表
export const getUserList = () => niwai.get('/users');

// 添加用户
export const addUser = data => niwai.post('/users',data);

// 根据id修改用户信息
export const updateUserInfo = (id,data) => niwai.put('/users/' + id,data);

// 根据id获取用户信息
export const getUserInfo = id => niwai.get('/users/' + id);

// 根据id删除用户信息
export const deleteUserInfo = id => niwai.delete('/users/' + id);

// 获取歌手列表
export const getSingerList = (pageNum,pageSize) => niwai.get('/singer/' +pageNum + '/' +pageSize );

// 添加歌手信息
export const addSinger = (data) => niwai.post('/singer',data);

// 删除歌手信息
export const deleteSinger = id => niwai.delete('/singer/' + id);

// 修改歌手信息
export const updateSinger = (id,data) => niwai.put('/singer/' + id,data);

//------------
// 获取专辑列表
export const getAlbumList = (pageNum,pageSize) => niwai.get('/album/' +pageNum + '/' +pageSize );

// 添加专辑信息
export const addAlbum = (data) => niwai.post('/album',data);

// 删除专辑信息
export const deleteAlbum = id => niwai.delete('/album/' + id);

// 修改专辑信息
export const updateAlbum = (id,data) => niwai.put('/album/' + id,data);