import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import React, {useLayoutEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLOR} from '../constant/color';
import RatingCus from '../components/Rating';
import CartProduct from '../components/CardProduct/CartProduct';
import Hello from '../components/hello';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getSingleProduct} from '../redux/slices/productSlice';
import {useState} from 'react';
import LoadingCus from '../components/LoadingCus';
import {getProductInCategory} from '../redux/slices/categorySlice';
import {addCart} from '../redux/slices/cartSlice';
import {addComment} from '../redux/slices/commentSlice';
import {showNoti} from '../toolkit/helper';
import {commentModal} from '../firebase/modalComment';
import {getInfoUser} from '../redux/slices/userSlice';
import CommentBox from '../components/CommentBox';
import {useCallback} from 'react';
import DialogCus from '../components/DialogCus';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
const {width, height} = Dimensions.get('window');

const ProductDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigation();
  const route = useRoute();
  const {id} = route.params;
  const {productDetail} = useSelector(state => state.productSlice);
  const {listProductInCategory} = useSelector(state => state.categorySlice);
  const {isLogin} = useSelector(state => state.authSlice);

  ///state
  const [loading, setLoading] = useState(true);
  const [loadingComment, setLoadingComment] = useState(true);
  const [num, setNum] = useState(1);
  const [message, setMessage] = useState('');
  const [listComment, setListComment] = useState([]);
  const [forcus, setForcus] = useState(false);
  const [userOj, setUserOj] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  //func
  const listCommentSort = useCallback(
    listComment.sort((a, b) => {
      return a.createAt - b.createAt;
    }),
    [listComment],
  );
  const handleAddComment = () => {
    if (message == '') {
      showNoti('Không để trống bình luận !!', 'error');
      return;
    }
    dispatch(addComment({message, idProduct: id, name: userOj.name}));
    setMessage('');
  };
  useEffect(() => {
    if (isLogin) {
      dispatch(getInfoUser()).then(res => {
        if (!res.error) {
          setLoading(false);
          setUserOj({
            name: res.payload.name,
            email: res.payload.email,
            phone: res.payload.phone,
            address: res.payload.address,
          });
        } else {
          setLoading(false);
          console.log(res);
          alert('error');
        }
      });
    }
  }, [isLogin]);

  useEffect(() => {
    dispatch(getSingleProduct(id)).then(res => {
      dispatch(getProductInCategory({id: res.payload.category_id}));
      setLoading(false);
    });
    commentModal.readComment(setListComment, id, setLoadingComment);
  }, [loading, id]);

  if (loading) {
    return <LoadingCus />;
  }
  return (
    <View>
      <ScrollView nestedScrollEnabled={true}>
        <View
          style={{
            backgroundColor: COLOR.primary,
            position: 'relative',
          }}>
          <View
            style={{
              width: width,
              backgroundColor: COLOR.primary,
            }}
          />
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: '55%',
              width: '100%',
              backgroundColor: '#f2f2f2',
              zIndex: 2,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            }}>
            <View
              style={{
                marginTop: '-54%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={{width: '50%', height: 230}}>
                <Image
                  resizeMode="stretch"
                  style={{width: '100%', height: '100%', borderRadius: 20}}
                  source={{
                    uri: productDetail?.image,
                  }}
                />
              </View>
              <View style={{marginLeft: 20, width: '50%'}}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    marginBottom: 10,
                    color: COLOR.second,
                  }}>
                  {productDetail?.name}
                </Text>
                <Text style={{marginBottom: 10}}>
                  <RatingCus
                    color={COLOR.primary}
                    rating={productDetail?.rating}
                  />
                </Text>
                <Text
                  style={{
                    textDecorationLine: 'line-through',
                    fontSize: 14,
                    marginBottom: 10,
                    color: COLOR.second,
                  }}>
                  {productDetail?.price?.toLocaleString()} đ
                </Text>
                <View
                  style={{
                    padding: 10,
                    backgroundColor: COLOR.third,
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: COLOR.second,
                    }}>
                    {productDetail?.price_sale_off?.toLocaleString()} đ
                  </Text>
                </View>
              </View>
            </View>
            <View style={{marginTop: 10}}>
              <Text
                style={{
                  fontSize: 22,
                  color: COLOR.black,
                  fontWeight: 'bold',
                  marginBottom: 10,
                }}>
                Thông tin sản phẩm
              </Text>
              <Text style={{textAlign: 'justify', color: COLOR.gray}}>
                {productDetail?.description}
              </Text>
            </View>
            <View style={{marginVertical: 10}}>
              <Text
                style={{fontSize: 18, fontWeight: 'bold', color: COLOR.black}}>
                Số lượng
              </Text>
              <View
                style={{
                  marginTop: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    num <= 1 ? setNum(1) : setNum(num => (num -= 1));
                  }}
                  style={{
                    backgroundColor: COLOR.third,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}>
                    -
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 18,
                    marginHorizontal: 10,
                    color: COLOR.black,
                  }}>
                  {num}
                </Text>

                <TouchableOpacity
                  onPress={() => setNum(num => (num += 1))}
                  style={{
                    backgroundColor: COLOR.third,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}>
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{flex: 1, marginVertical: 10}}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: COLOR.black,
                }}>
                Sản phẩm liên quan
              </Text>
            </View>
          </View>
        </View>
        <FlatList
          horizontal
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          data={listProductInCategory}
          renderItem={({item}) => <CartProduct item={item} detail={200} />}
        />

        <View style={{paddingHorizontal: 20, marginTop: 10, marginBottom: 100}}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: COLOR.black,
              marginBottom: 10,
            }}>
            Nhận xét sản phẩm
          </Text>

          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              padding: 20,
              borderBottomWidth: 1,
            }}>
            <View style={{width: 50, height: 50}}>
              <Image
                style={{width: '100%', height: '100%', borderRadius: 50}}
                source={{
                  uri: 'https://plus.unsplash.com/premium_photo-1682309761340-3f8b1cbaa655?auto=format&fit=crop&q=80&w=1824&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                }}
              />
            </View>
            <View style={{flex: 1, marginLeft: 10}}>
              <Text style={{fontSize: 22, fontWeight: 'bold', color: 'black'}}>
                Van Duy
              </Text>
              <Text style={{marginTop: 10, color: COLOR.gray}}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Veritatis eius laboriosam magni cumque ut fugit facilis modi
                voluptas assumenda quasi atque, ullam velit odio corrupti,
                itaque cupiditate nam dicta soluta.
              </Text>
            </View>
          </View> */}
          {loadingComment ? (
            <View style={{maxHeight: 300}}>
              <SkeletonPlaceholder
                borderRadius={4}
                backgroundColor={COLOR.primary}>
                {[1].map((item, index) => (
                  <View
                    key={index}
                    style={{
                      width: 200,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 10,
                    }}>
                    <View
                      style={{width: '100%', height: 50, borderRadius: 10}}
                    />
                    <View
                      style={{
                        width: '100%',
                        height: 50,
                        borderRadius: 10,
                        marginTop: 10,
                        marginLeft: 40,
                      }}
                    />
                  </View>
                ))}
              </SkeletonPlaceholder>
            </View>
          ) : (
            <View style={{maxHeight: 300}}>
              <FlatList
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                data={listCommentSort.reverse()}
                renderItem={({item}) => <CommentBox message={item} />}
              />
            </View>
          )}

          {!isLogin ? (
            <View>
              <Text style={{color: COLOR.gray}}>
                Bạn cần đăng nhập để có thể bình luận !!
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigate.navigate('Login');
                }}>
                <Text style={{color: COLOR.primary}}>Đăng nhập ngay</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                marginTop: 10,
              }}>
              <KeyboardAwareScrollView>
                <TextInput
                  onFocus={() => {
                    setForcus(true);
                  }}
                  onBlur={() => {
                    setForcus(false);
                  }}
                  value={message}
                  onChangeText={value => setMessage(value)}
                  placeholderTextColor={COLOR.gray}
                  placeholder={'Bình luận...'}
                  style={{
                    width: '90%',
                    height: 40,
                    borderWidth: 1,
                    borderRadius: 10,
                    padding: 10,
                    color: COLOR.black,
                    backgroundColor: 'white',
                  }}
                />
              </KeyboardAwareScrollView>

              <TouchableOpacity onPress={() => handleAddComment()}>
                <Ionicons name="send" size={24} color={COLOR.primary} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      <View
        style={{
          display: forcus ? 'none' : 'flex',
          width: '100%',
          position: 'absolute',
          bottom: 0,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, .6) ',
          paddingVertical: 10,
        }}>
        <Text style={{color: COLOR.second, fontSize: 16, fontWeight: 'bold'}}>
          {num} Sản phẩm
        </Text>
        <TouchableOpacity
          onPress={() => {
            dispatch(
              addCart({
                ...productDetail,
                quantity: num,
              }),
            );
            setNum(1);
          }}
          style={{
            backgroundColor: COLOR.third,
            padding: 10,
            borderRadius: 10,
          }}>
          <Text style={{fontSize: 14, color: COLOR.second}}>
            Thêm vào giỏ hàng
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: COLOR.second,
              textAlign: 'center',
            }}>
            {(num * productDetail?.price_sale_off).toLocaleString()} đ
          </Text>
        </TouchableOpacity>
      </View>
      <DialogCus />
    </View>
  );
};

export default ProductDetail;
