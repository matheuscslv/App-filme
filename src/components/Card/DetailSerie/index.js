import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Container,
  ImageProduct,
  Content,
  Title,
  Description,
  BoxAvaliation,
  Avaliation,
  ContentFooter,
  ButtonStatus,
  TextButtonStatus,
} from './styles';
import { colors } from '~/styles';

import api, { url_image } from '~/services/api';
import Modal from 'react-native-modal';
import Slider from 'react-native-slider';

import DropdownAlert from 'react-native-dropdownalert';

import store from '~/services/storage';

export default function DetailSerie({ navigation }) {
  const [status, setStatus] = useState(true);
  const [serie, setSerie] = useState(navigation.getParam('item'));
  const [modalSettingVisible, setModalSettingsVisible] = useState(false);
  const [modalAvaliationVisible, setModalAvaliationVisible] = useState(false);

  const [avaliation, setAvaliation] = useState(0.0);

  const refAlert = useRef(null);

  useEffect(() => {
    navigation.setParams({ title: extenseName(serie.title) });

    navigation.setParams({
      changeSettings: () => changeSettings(),
    });
  }, []);

  function extenseName(s) {
    return s.split('').length > 30
      ? `${s.split('').slice(0, 30).join('')}...`
      : s;
  }

  function changeSettings() {
    setModalSettingsVisible(!modalSettingVisible);
  }

  //1 assistido
  async function addListWatched(type, text) {
    //await store.save("series-evelyn", null);
    try {
      const series_evelyn = await store.get('series-evelyn');
      if (series_evelyn == null) {
        await store.save('series-evelyn', [{ ...serie, type: 1 }]);
      } else {
        const filter = series_evelyn.filter((item) => item.id == serie.id);

        if (filter.length == 0) {
          await store.save('series-evelyn', [
            ...series_evelyn,
            { ...serie, type: 1 },
          ]);
        } else {
          const result = series_evelyn.map((item) =>
            item.id == serie.id
              ? { ...item, avaliation: serie.avaliation, type: 1 }
              : item
          );
          await store.save('series-evelyn', result);
        }
      }
    } catch (error) {
      console.log(error);
    }

    changeSettings();
    refAlert.current.alertWithType(type, 'Sucesso', text);
  }

  //2 não assistido
  async function addListNotWatched(type, text) {
    //await store.save("series-evelyn", null);
    try {
      const series_evelyn = await store.get('series-evelyn');
      if (series_evelyn == null) {
        await store.save('series-evelyn', [{ ...serie, type: 2 }]);
      } else {
        const filter = series_evelyn.filter((item) => item.id == serie.id);

        if (filter.length == 0) {
          await store.save('series-evelyn', [
            ...series_evelyn,
            { ...serie, type: 2 },
          ]);
        } else {
          const result = series_evelyn.map((item) =>
            item.id == serie.id
              ? { ...item, avaliation: serie.avaliation, type: 2 }
              : item
          );
          await store.save('series-evelyn', result);
        }
      }
    } catch (error) {
      console.log(error);
    }

    changeSettings();
    refAlert.current.alertWithType(type, 'Sucesso', text);
  }

  async function removeList(type, text) {
    const a = await store.get('series-evelyn');
    const filterA = a.filter((item) => item.id != serie.id);
    await store.save('series-evelyn', filterA);

    changeSettings();
    refAlert.current.alertWithType(type, 'Sucesso', text);
  }

  async function changeAvaliation() {
    const series_evelyn = await store.get('series-evelyn');
    if (series_evelyn != null) {
      const filter = series_evelyn.filter((item) => item.id == serie.id);

      if (filter.length > 0) {
        const result = series_evelyn.map((item) =>
          item.id == serie.id ? { ...item, avaliation: serie.avaliation } : item
        );
        await store.save('series-evelyn', result);
      }
    }
    setModalAvaliationVisible(!modalAvaliationVisible);
  }

  return (
    <Container>
      <ImageProduct
        source={{ uri: `${serie.poster}` }}
        resizeMode={'stretch'}
      />

      <Content>
        <View style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: colors.primary,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <Title style={{ paddingHorizontal: 10 }}>{serie.title}</Title>
            <BoxAvaliation onPress={() => changeAvaliation()}>
              <Avaliation>{serie.avaliation}</Avaliation>
            </BoxAvaliation>
          </View>

          <Description>{serie.description}</Description>
        </View>
      </Content>

      <View>
        <Modal isVisible={modalSettingVisible}>
          <View
            style={{ borderRadius: 25, backgroundColor: '#fff', padding: 20 }}
          >
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontFamily: 'Quicksand-Bold',
                  }}
                >
                  Configurações da Série
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    setModalSettingsVisible(!setModalSettingsVisible)
                  }
                >
                  <Icon name="close" size={30} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={{
                borderRadius: 50,
                alignItems: 'center',
                marginBottom: 10,
                backgroundColor: '#3b5998',
                padding: 10,
              }}
              onPress={() => {
                addListNotWatched(
                  'info',
                  'Adicionado a lista de não assistidos'
                );
              }}
            >
              <Text style={{ color: '#fff', fontFamily: 'Quicksand-Bold' }}>
                Adicionar a Lista de Não Assistidos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                borderRadius: 50,
                alignItems: 'center',
                marginBottom: 10,
                backgroundColor: '#080',
                padding: 10,
              }}
              onPress={() => {
                addListWatched('success', 'Adicionado a lista de assistidos');
              }}
            >
              <Text style={{ color: '#fff', fontFamily: 'Quicksand-Bold' }}>
                Adicionar a Lista de Assistidos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                borderRadius: 50,
                alignItems: 'center',
                backgroundColor: '#8b0000',
                padding: 10,
              }}
              onPress={() => {
                removeList('error', 'Removido de todas as listas');
              }}
            >
              <Text style={{ color: '#fff', fontFamily: 'Quicksand-Bold' }}>
                Remover de Todas as Listas
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>

      <View>
        <Modal isVisible={modalAvaliationVisible}>
          <View
            style={{ borderRadius: 25, backgroundColor: '#fff', padding: 20 }}
          >
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontFamily: 'Quicksand-Bold',
                  }}
                >
                  Avaliação do Filme
                </Text>
                <TouchableOpacity onPress={() => changeAvaliation()}>
                  <Icon name="close" size={30} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <Text
              style={{ fontFamily: 'Quicksand-Bold', color: colors.primary }}
            >
              NOTA: {Number(serie.avaliation)}
            </Text>
            <Slider
              value={Number(serie.avaliation / 10)}
              minimumTrackTintColor={colors.success}
              maximumTrackTintColor={colors.primary}
              thumbTintColor={colors.primary}
              onValueChange={(value) => {
                setSerie({
                  ...serie,
                  avaliation: Number(value * 10).toFixed(1),
                });
              }}
            />

            {/* <TouchableOpacity style={{ borderRadius: 50, alignItems: 'center', backgroundColor: "#080", padding: 10 }} onPress={() => changeAvaliation()}>
              <Text style={{ color: '#fff' }}>Fechar</Text>
            </TouchableOpacity> */}
          </View>
        </Modal>
      </View>

      {/* <ContentFooter>
        <ButtonStatus onPress={() => setStatus(!status)}>
          <TextButtonStatus>{serie.status ? 'Assitido' : 'Não Assistido'}</TextButtonStatus>
        </ButtonStatus>
      </ContentFooter> */}

      <DropdownAlert closeInterval={2000} ref={refAlert} />
    </Container>
  );
}

DetailSerie.navigationOptions = ({ navigation }) => {
  const title = navigation.getParam('title');
  return {
    headerTitle: title || '',
    headerRight: (
      <TouchableOpacity
        onPress={() => navigation.state.params.changeSettings()}
      >
        <Icon
          style={{ marginRight: 10 }}
          name="settings"
          size={30}
          color="#fff"
        />
      </TouchableOpacity>
    ),
  };
};
