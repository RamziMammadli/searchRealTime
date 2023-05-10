import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import filter from 'lodash.filter' //lodash npm package for filter

interface UserData { //type of user
  login: {
    username: string;
  };
  name: {
    first: string;
    last: string;
  };
  email: string;
  picture: {
    thumbnail: string;
  };
}

const API_ENDPOINT = 'https://randomuser.me/api/?results=50'; // api where from fetch

const App = () => {
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<UserData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fullData, setFullData] = useState<UserData[]>([]);

  useEffect(() => {
    setLoading(true);
    fetchData(API_ENDPOINT);
  }, []);

  const fetchData = async (url: string) => {
    try {
      const response = await fetch(url);
      const json = await response.json();
      setData(json.results);
      setFullData(json.results)
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} color='#5500dc' />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error is fetching data, check internet</Text>
      </View>
    );
  }

  const handleGo = (e: any) => {  //auto search , lodash used
    setSearch(e)
    const queryData = e.toLowerCase()
    const filtered = filter(fullData, (user: any) => {
      return contains(user, queryData)
    })
    setData(filtered)
  }

  const contains = ({name, email}: any, e: any) => {
    const {first, last} = name
    
    if(first.includes(e) || (last.includes(e) || email.includes(e))) { //inputs value auto detect from name, surname and email
      return true
    }

    return false
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder='Search'
        clearButtonMode='always'
        style={styles.textInput}
        autoCapitalize='none'
        autoCorrect={false}
        value={search}
        onChangeText={(e) => handleGo(e)}
      />
      <FlatList
        data={data}
        keyExtractor={(item) => item.login.username}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.picture.thumbnail }} style={styles.image} />
            <View>
              <Text style={styles.textname}>
                {item.name.first} {item.name.last}
              </Text>
              <Text style={styles.textemail}>{item.email}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor:'#fff'
  },
  textInput: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 10,
    borderBottomColor:'#dedede',
    borderBottomWidth:1,
    paddingVertical:10
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textname: {
    fontSize: 17,
    marginLeft: 10,
    fontWeight: '500',
  },
  textemail: {
    fontSize: 14,
    marginLeft: 10,
    color: 'grey',
  },
});
