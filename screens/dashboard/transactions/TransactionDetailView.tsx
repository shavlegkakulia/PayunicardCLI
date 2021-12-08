import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import colors from '../../../constants/colors';
import {
  IFund,
  IGetTransactionDetailsResponse,
} from '../../../services/UserService';
import {
  CurrencyConverter,
  CurrencySimbolConverter,
} from '../../../utils/Converter';
import {formatDate} from '../../../utils/utils';
import envs from './../../../config/env';
import RNFetchBlob from 'rn-fetch-blob';
import AuthService from '../../../services/AuthService';
import { useSelector } from 'react-redux';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../../../redux/action_types/translate_action_types';

interface IProps {
  statement: IGetTransactionDetailsResponse | undefined;
  fundStatement: IFund | undefined;
  onDownload?: (tranID: number | undefined) => void;
  sendHeader: (element: JSX.Element | null) => void;
}

const TRANSACTION_TYPES = {
  CLIRING: 1,
  BLOCKED: 2,
  TRANCONVERT: 3,
  TRANPOS: 4,
  TRANUTILITY: 5,
};

const ViewCliring: React.FC<IProps> = props => {
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  return (
    <>
      {(props.statement?.mccGroupName !== undefined ||
        props.statement?.abvrName !== undefined) && (
        <View style={styles.cliringHeader}>
          <View style={styles.directionRow}>
            <Text style={styles.detailCategory} numberOfLines={1}>
              {props.statement?.mccGroupName}
            </Text>
            <Text style={styles.groupName} numberOfLines={1}>
              {props.statement?.abvrName?.trimEnd()}
            </Text>
          </View>
        </View>
      )}
      <View style={styles.directionRow}>
        <View style={styles.detailBox}>
          <Image
            style={styles.detailIcon}
            source={{uri: `${envs.CDN_PATH}mccicons/shopping-icon.png`}}
          />
        </View>

        <View>
          <View style={styles.currencyColumn}>
            <Text style={styles.amountccy}>
              {CurrencyConverter(props.statement?.amount)}{' '}
            </Text>
            <Text style={styles.amountccy}>
              {CurrencySimbolConverter(props.statement?.ccy)}
            </Text>
          </View>

          {props.statement?.tranDate && (
            <View style={styles.tranDateColumn}>
              <Text style={styles.textDescStyle}>
                {formatDate(props.statement?.tranDate)}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.splitter}></View>

      <View style={styles.detailBox}>
        <Text style={styles.textHeaderStyle}>{translate.t('common.details')}</Text>
        {props.statement?.amount !== undefined && (
          <View style={styles.directionRow}>
            <Text style={styles.textDescStyle}>თანხა</Text>
            <Text style={styles.textDescValueStyle}>
              {CurrencyConverter(props.statement?.amount)}
            </Text>
          </View>
        )}
        {props.statement?.abvrName &&
          props.statement?.abvrName?.trim().length > 0 && (
            <View style={styles.directionRow}>
              <Text style={styles.textDescStyle}>მერჩანტი</Text>
              <Text style={styles.textDescValueStyle}>
                {props.statement?.abvrName.trimEnd()}
              </Text>
            </View>
          )}
        {props.statement?.uniBonus && (
          <View style={styles.directionRow}>
            <Text style={styles.textDescStyle}>უნიქულები</Text>
            <Text style={styles.textDescValueStyle}>
              {CurrencyConverter(props.statement?.uniBonus)}
            </Text>
          </View>
        )}
        {props.statement?.senderMaskedCardNumber && (
          <View style={styles.directionRow}>
            <Text style={styles.textDescStyle}>ბარათის ნომერი</Text>
            <Text style={styles.textDescValueStyle}>
              {props.statement?.receiveraccount}
            </Text>
          </View>
        )}
        {props.statement?.tranDate && (
          <View style={styles.directionRow}>
            <Text style={styles.textDescStyle}>გადახდის თარიღი</Text>
            <Text style={styles.textDescValueStyle}>
              {formatDate(props.statement?.tranDate)}
            </Text>
          </View>
        )}
        {props.statement?.dateCreated && (
          <View style={styles.directionRow}>
            <Text style={styles.textDescStyle}>გატარების თარიღი</Text>
            <Text style={styles.textDescValueStyle}>
              {formatDate(
                props.statement?.dateCreated
                  ? props.statement?.dateCreated.toString()
                  : '',
              )}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.splitter}></View>

      <View style={[styles.detailBox, styles.defDetail]}>
        <Text style={styles.textHeaderStyle}>ტრანზაქციის {translate.t('common.details')}</Text>
        {props.statement?.aprCode &&
          props.statement?.aprCode.trim().length > 0 && (
            <View style={styles.directionRow}>
              <Text style={styles.textDescStyle}>ავტორიზაციის კოდი</Text>
              <Text style={styles.textDescValueStyle}>
                {props.statement?.aprCode}
              </Text>
            </View>
          )}
        {props.statement?.tranid && (
          <View style={styles.directionRow}>
            <Text style={styles.textDescStyle}>ტრანზაქციის იდენტიფიკატორი</Text>
            <Text style={styles.textDescValueStyle}>
              {props.statement?.tranid}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.download}>
        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={props.onDownload?.bind(this, props.statement?.tranid)}>
          <View style={styles.downloadBg}>
            <Image
              source={require('./../../../assets/images/icon-download-primary.png')}
            />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const ViewTransfer: React.FC<IProps> = props => {
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  return (
    <>
      <View style={[styles.directionRow, styles.transactionHeader]}>
        <View style={styles.detailBox}>
          <Image
            style={styles.detailIcon}
            source={{uri: `${envs.CDN_PATH}mccicons/other-expances-icon.png`}}
          />
        </View>

        <View>
          <View style={styles.currencyColumn}>
            <Text style={styles.amountccy}>
              {CurrencyConverter(props.statement?.amount)}{' '}
            </Text>
            <Text style={styles.amountccy}>
              {CurrencySimbolConverter(props.statement?.ccy)}
            </Text>
          </View>

          {(props.statement?.tranDate || props.statement?.dateCreated) && (
            <View style={styles.tranDateColumn}>
              <Text style={styles.textDescValueStyle}>
                {formatDate(
                  props.statement?.dateCreated?.toString() ||
                    props.statement?.tranDate,
                )}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.splitter}></View>

      <View style={styles.detailBox}>
        <Text style={styles.textHeaderStyle}>საიდან</Text>
        {props.statement?.senderName && (
          <View style={styles.directionRow}>
            <Text style={styles.textDescStyle}>გამგზავნის სახელი</Text>
            <Text style={styles.textDescValueStyle}>
              {props.statement.senderName}
            </Text>
          </View>
        )}
        {props.statement?.senderaccount && (
          <View style={styles.directionRow}>
            <Text style={styles.textDescStyle}>ანგარიშის ნომერი</Text>
            <Text style={styles.textDescValueStyle}>
              {props.statement?.senderaccount}
            </Text>
          </View>
        )}

        {props.statement?.senderBankCode && (
          <View style={styles.directionRow}>
            <Text style={styles.textDescStyle}>გბანკის კოდი</Text>
            <Text style={styles.textDescValueStyle}>
              {props.statement?.senderBankCode}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.splitter}></View>

      <View style={styles.detailBox}>
        <Text style={styles.textHeaderStyle}>სად</Text>
        {props.statement?.receivername && (
          <View style={styles.directionRow}>
            <Text style={styles.textDescStyle}>მიმღები</Text>
            <Text style={styles.textDescValueStyle}>
              {props.statement.receivername}
            </Text>
          </View>
        )}
        {props.statement?.receiveraccount && (
          <View style={styles.directionRow}>
            <Text style={styles.textDescStyle}>ანგარიშის ნომერი</Text>
            <Text style={styles.textDescValueStyle}>
              {props.statement?.receiveraccount}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.splitter}></View>

      <View style={styles.detailBox}>
        <Text style={styles.textHeaderStyle}>{translate.t('common.details')}</Text>
        {props.statement?.amount && (
          <View style={styles.directionRow}>
            <Text style={styles.textDescStyle}>თანხა</Text>
            <Text style={styles.textDescValueStyle}>
              {CurrencyConverter(props.statement.amount)}
            </Text>
          </View>
        )}
        {props.statement?.description && (
          <View style={styles.directionRow}>
            <Text style={styles.textDescStyle}>დანიშნულება</Text>
            <Text style={styles.textDescValueStyle}>
              {props.statement?.description}
            </Text>
          </View>
        )}
        {props.statement?.tranDate && (
          <View style={styles.directionRow}>
            <Text style={styles.textDescStyle}>გადახდის თარიღი</Text>
            <Text style={styles.textDescValueStyle}>
              {formatDate(props.statement?.tranDate)}
            </Text>
          </View>
        )}
        {props.statement?.dateCreated && (
          <View style={styles.directionRow}>
            <Text style={styles.textDescStyle}>გატარების თარიღი</Text>
            <Text style={styles.textDescValueStyle}>
              {formatDate(
                props.statement?.dateCreated
                  ? props.statement?.dateCreated.toString()
                  : '',
              )}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.splitter}></View>

      <View style={[styles.detailBox, styles.defDetail]}>
        <Text style={styles.textHeaderStyle}>ტრანზაქციის {translate.t('common.details')}</Text>
        {props.statement?.tranid && (
          <View style={styles.directionRow}>
            <Text style={styles.textDescStyle}>ტრანზაქციის იდენტიფიკატორი</Text>
            <Text style={styles.textDescValueStyle}>
              {props.statement?.tranid}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.download}>
        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={props.onDownload?.bind(this, props.statement?.tranid)}>
          <View style={styles.downloadBg}>
            <Image
              source={require('./../../../assets/images/icon-download-primary.png')}
            />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const ViewUtility: React.FC<IProps> = props => {
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  return (
    <>
      <View style={[styles.directionRow, styles.utilityHeader]}>
        <View style={styles.detailBox}>
          <Image
            style={styles.detailIcon}
            source={{uri: `${envs.CDN_PATH}mccicons/utility-payment-icon.png`}}
          />
        </View>

        <View>
          <View style={styles.currencyColumn}>
            <Text style={styles.amountccy}>
              {CurrencyConverter(props.statement?.amount)}{' '}
            </Text>
            <Text style={styles.amountccy}>
              {CurrencySimbolConverter(props.statement?.ccy)}
            </Text>
          </View>

          {(props.statement?.tranDate || props.statement?.dateCreated) && (
            <View style={styles.tranDateColumn}>
              <Text style={styles.textDescStyle}>
                {formatDate(
                  props.statement?.dateCreated?.toString() ||
                    props.statement?.tranDate,
                )}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.splitter}></View>

      <View style={styles.detailBox}>
        <Text style={styles.textHeaderStyle}>საიდან</Text>

        {props.statement?.senderMaskedCardNumber && (
          <View style={styles.directionRow}>
            <Text style={styles.textDescStyle}>ბარათის ნომერი</Text>
            <Text style={styles.textDescValueStyle}>
              {props.statement?.senderMaskedCardNumber}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.splitter}></View>

      <View style={styles.detailBox}>
        <Text style={styles.textHeaderStyle}>სად</Text>
        {props.statement?.description && (
          <>
            <View style={styles.directionRow}>
              <Text style={styles.textDescStyle}>პროვაიდერის დასახელება</Text>
              <Text style={styles.textDescValueStyle}>
                {props.statement.description.split('/')[0].split(':')[1]}
              </Text>
            </View>

            <View style={styles.directionRow}>
              <Text style={styles.textDescStyle}>მომხმარებელი</Text>
              <Text style={styles.textDescValueStyle}>
                {props.statement.description.split('/')[1]}
              </Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.splitter}></View>

      <View style={styles.detailBox}>
        <Text style={styles.textHeaderStyle}>{translate.t('common.details')}</Text>
        {props.statement?.amount && (
          <View style={styles.directionRow}>
            <Text style={styles.textDescStyle}>თანხა</Text>
            <Text style={styles.textDescValueStyle}>
              {CurrencyConverter(props.statement.amount)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.splitter}></View>

      <View style={[styles.detailBox, styles.defDetail]}>
        <Text style={styles.textHeaderStyle}>ტრანზაქციის {translate.t('common.details')}</Text>
        {props.statement?.tranid && (
          <View style={styles.directionRow}>
            <Text style={styles.textDescStyle}>ტრანზაქციის იდენტიფიკატორი</Text>
            <Text style={styles.textDescValueStyle}>
              {props.statement?.tranid}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.download}>
        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={props.onDownload?.bind(this, props.statement?.tranid)}>
          <View style={styles.downloadBg}>
            <Image
              source={require('./../../../assets/images/icon-download-primary.png')}
            />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const ViewBlocked: React.FC<IProps> = props => {
  return (
    <>
      <View style={[styles.directionRow, styles.utilityHeader]}>
        <View style={styles.detailBox}>
          <Image
            style={styles.detailIcon}
            source={{uri: `${envs.CDN_PATH}mccicons/holded-icon.png`}}
          />
        </View>

        <View>
          <View style={styles.currencyColumn}>
            <Text style={[styles.amountccy, styles.blockedAmount]}>
              {CurrencyConverter(props.fundStatement?.amount)}{' '}
            </Text>
            <Text style={[styles.amountccy, styles.blockedAmount]}>
              {CurrencySimbolConverter(props.fundStatement?.currency)}
            </Text>
          </View>

          {props.fundStatement?.transactionDate && (
            <View style={styles.tranDateColumn}>
              <Text style={styles.textDescStyle}>
                {formatDate(props.fundStatement?.transactionDate)}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.splitter}></View>

      <View style={styles.detailBox}>
      <Text style={[styles.textHeaderStyle, styles.bolder]}>ბლოკირებული თანხა</Text>
        <Text style={styles.textHeaderStyle}>მერჩანტის სახელი</Text>
        {props.fundStatement?.merchantDescription && (
          <View style={styles.directionRow}>
            <Text style={styles.textDescStyle}>
              {props.fundStatement?.merchantDescription}
            </Text>
          </View>
        )}
        {props.fundStatement?.terminalNumber && (
          <View style={styles.directionRow}>
            <Text style={styles.textDescStyle}>ტერმინალის ნომერი</Text>
            <Text style={styles.textDescValueStyle}>
              {props.fundStatement?.terminalNumber}
            </Text>
          </View>
        )}
        {props.fundStatement?.cardNumber && (
          <View style={styles.directionRow}>
            <Text style={styles.textDescStyle}>ბარათის ნომერი</Text>
            <Text style={styles.textDescValueStyle}>
              {props.fundStatement?.cardNumber}
            </Text>
          </View>
        )}
      </View>
    </>
  );
};

const TransactionDetailView: React.FC<IProps> = props => {
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const [transactionType, setTransactionType] = useState<number | undefined>(
    TRANSACTION_TYPES.CLIRING,
  );

  const downloadPdf = async (tranID: number | undefined) => {
    let token = await AuthService.getToken();

    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ).then(() => {
      const {dirs} = RNFetchBlob.fs;
      const dirToSave =
        Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
      const configfb = {
        addAndroidDownloads: {
          fileCache: true,
          useDownloadManager: true,
          notification: true,
          description: 'An Pdf file.',
          mediaScannable: true,
          title: 'Statements.pdf',
          mime: 'application/pdf',
          path: `${dirToSave}/Statements.pdf`,
        },
      };
      const configOptions = Platform.select({
        ios: {
          fileCache: configfb.addAndroidDownloads.fileCache,
          title: configfb.addAndroidDownloads.title,
          path: configfb.addAndroidDownloads.path,
          appendExt: 'pdf',
        },
        android: {...configfb},
      });

      RNFetchBlob.config({
        ...configOptions,
      })
        .fetch(
          'GET',
          `${envs.API_URL}User/ExportUserAccountStatementsAsPdf?TranID=${tranID}`,
          {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/pdf',
            responseType: 'blob',
          },
        )
        .then(res => {
          if (Platform.OS === 'ios') {
            RNFetchBlob.fs.writeFile(
              configfb.addAndroidDownloads.path,
              res.data,
              'base64',
            );
            RNFetchBlob.ios.previewDocument(configfb.addAndroidDownloads.path);
          }
          console.log('The file saved to ', res);
        });
    });
  };

  useEffect(() => {
    if (props.fundStatement) {
      setTransactionType(TRANSACTION_TYPES.BLOCKED);
      return;
    }
    if (
      props.statement?.opClass == 'CLIRING.C' ||
      props.statement?.opClass == 'CLIRING.C_EUR' ||
      props.statement?.opClass == 'CLIRING.C_USD' ||
      props.statement?.opClass == 'CLIRING.D' ||
      props.statement?.opClass == 'CLIRING.D_EUR' ||
      props.statement?.opClass == 'CLIRING.D_USD' ||
      props.statement?.opClass == 'CLIRING.D_Fee'
    ) {
      setTransactionType(TRANSACTION_TYPES.CLIRING);
    } else if (props.statement?.opClass == 'P2B') {
      setTransactionType(TRANSACTION_TYPES.TRANUTILITY);
    } else if (
      props.statement?.opClass == 'B2P.Bank' ||
      props.statement?.opClass == 'B2P.Bank_EUR' ||
      props.statement?.opClass == 'B2P.Bank_USD' ||
      props.statement?.opClass == 'B2P.Enrollment' ||
      props.statement?.opClass == 'B2PGL' ||
      props.statement?.opClass == 'B2P.F' ||
      props.statement?.opClass == 'P2B_FEE' ||
      props.statement?.opClass == 'P2P.EXCHANGE' ||
      props.statement?.opClass == 'P2P.INTER.out' ||
      props.statement?.opClass == 'P2P.INTER.in' ||
      props.statement?.opClass == 'P2B.Bank' ||
      props.statement?.opClass == 'PACKAGE.Out'
    ) {
      setTransactionType(TRANSACTION_TYPES.TRANCONVERT);
    } else if (props.statement?.terminal == 'A') {
      setTransactionType(TRANSACTION_TYPES.TRANPOS);
    }
  }, []);

  useEffect(() => {
    const data = (
      <View style={styles.header}>
        <Text style={styles.title}>ტრანსზაქციის {translate.t('common.details')}</Text>
      </View>
    );
    props.sendHeader(data);
  }, []);

  return (
    <View style={styles.container}>
      {transactionType === TRANSACTION_TYPES.CLIRING && (
        <ViewCliring {...props} onDownload={downloadPdf} />
      )}

      {transactionType === TRANSACTION_TYPES.TRANCONVERT && (
        <ViewTransfer {...props} onDownload={downloadPdf} />
      )}

      {transactionType === TRANSACTION_TYPES.TRANUTILITY && (
        <ViewUtility {...props} onDownload={downloadPdf} />
      )}

      {transactionType === TRANSACTION_TYPES.BLOCKED && (
        <ViewBlocked {...props} onDownload={downloadPdf} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 26,
  },
  title: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'center',
    color: colors.black,
  },
  detailBox: {
    marginTop: 0,
  },
  textHeaderStyle: {
    fontFamily: 'FiraGO-Bold',
    fontSize: 14,
    lineHeight: 17,
    color: colors.labelColor,
    marginBottom: 5,
  },
  textDescStyle: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'center',
    color: colors.labelColor,
    marginBottom: 5,
  },
  textDescValueStyle: {
    fontFamily: 'FiraGO-Book',
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'center',
    color: colors.labelColor,
    marginBottom: 5,
  },
  amountccy: {
    fontFamily: 'FiraGO-Bold',
    fontSize: 18,
    lineHeight: 21,
    textAlign: 'center',
    color: colors.danger,
  },

  aboutColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailCategory: {
    fontFamily: 'FiraGO-Medium',
    lineHeight: 17,
    fontSize: 14,
    color: colors.labelColor,
    marginRight: 10,
    maxWidth: '50%',
  },
  groupName: {
    fontFamily: 'FiraGO-Medium',
    fontWeight: '700',
    lineHeight: 17,
    fontSize: 14,
    color: colors.labelColor,
    maxWidth: '50%',
  },
  detailIcon: {
    width: 65,
    height: 65,
    alignSelf: 'center',
  },
  currencyColumn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  tranDateColumn: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 5,
  },
  splitter: {
    borderColor: colors.inputBackGround,
    borderTopWidth: 1,
    marginVertical: 30,
  },
  defDetail: {
    marginBottom: 40,
  },
  blockedAmount: {
    color: colors.labelColor,
  },
  directionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cliringHeader: {
    marginVertical: 20,
  },
  transactionHeader: {
    marginTop: 20,
  },
  utilityHeader: {
    marginTop: 20,
  },
  download: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  downloadBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  downloadBg: {
    backgroundColor: colors.inputBackGround,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  bolder: {
    color: colors.black,
    marginBottom: 10
  }
});

export default TransactionDetailView;
