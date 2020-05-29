/* eslint-disable camelcase */
// /* eslint-disable prettier/prettier */
import Dash from 'dash'
const DashmachineCrypto = require('dashmachine-crypto')

let client
let clientTimeoutIntervall
let registerIdentityInterval
let registerNameInterval
let loginPinInterval

// mnemonic: "come sight trade detect travel hazard suit rescue special clip choose crouch"

export const state = () => ({
  //     isClientError : false,
  // isSyncing: false,
  //     mnemonic: "know cannon truth test sort few above drama client road scatter scrap",//null, // "drastic raise hurry step always person bundle end humble toss estate inner",
  //     identityId: "GrkDFuUUuxfvcVTjU8mhuaEx3acaY8FE1DTRyLLFyWhi",
  //     loginPin: "",
  //     loginPinTimeLeft: 0,
  //     wdsContractId: "9GHRxvyYDmWz7pBKRjPnxjsJbbgKLngtejWWp3kEY1vB", // TODO make wds vars dynamic / derive them
  //     wdsVendorId: "Aobc5KKaA4ZqzP7unc6WawQXQEK2S3y6EwrmvJLLn1ui",
  //     wdsLastDoc: undefined,
  //     name: {
  //         label: 'polldancer',
  //         isRegistered: true,
  //         docId:"9KB3o1TTHiwqTLuHVPKzxJb7H4CmRfWEHRUjuU4tEGD7"
  //     },
  //     snackbar: {
  //     }
  //     // mnemonic: "orphan bean draw casual parrot crack pool filter fault cannon dinosaur someone"
  // })
  isClientError: false,
  isSyncing: false,
  // mnemonic: null, // "drastic raise hurry step always person bundle end humble toss estate inner",
  mnemonic:
    'olympic dance spider bid soap butter cradle penalty waste sand situate vessel',
  // mnemonic: undefined,
  identityId: null,
  loginPin: '',
  loginPinTimeLeft: 0,
  wdsContractId: 'DBVuaTbU8PY9weNrg8RZPerNnv4oEdRWwSa4qXUG7ji4',
  wdsVendorId: '2JwFfLfCk8m139U778HzLA315s8BDXEBARyWEbEnrdbs',
  wdsLastDoc: undefined,
  name: {
    label: null,
    isRegistered: false,
    isValid: false,
    docId: null
  },
  snackbar: {}
  // mnemonic: "orphan bean draw casual parrot crack pool filter fault cannon dinosaur someone"
})

// // export const mutations = {
// // }

export const getters = {
  freshAddress() {
    const address = client.account.getUnusedAddress().address
    return address
  },
  async confirmedBalance() {
    // TODO weird thing: this function fires before await initWallet() resolves
    // console.log("get balance not ready Confirmed Balance", client.account.getConfirmedBalance());
    // console.log("get balance not ready Unconfirmed Balance", client.account.getUnconfirmedBalance());
    await client.isReady()
    console.log(
      'get balance Confirmed Balance',
      client.account.getConfirmedBalance()
    )
    console.log(
      'get balance Unconfirmed Balance',
      client.account.getUnconfirmedBalance()
    )
    return client.account.getConfirmedBalance()
  },
  setupFinished(state) {
    console.log(state)
    return state.mnemonic && state.identityId
  }
}
export const mutations = {
  clearClientErrors(state) {
    state.clientErrorMsg = ''
    state.isClientError = false
    state.isSyncing = false
  },
  setClientErrors(state, msg) {
    state.clientErrorMsg = msg
    state.isClientError = true
    state.isSyncing = false
  },
  setSyncing(state, isSyncing) {
    state.isSyncing = isSyncing
  },
  setLoginPin(state) {
    const random_num = new Uint8Array(6) // 2048 = number length in bits
    console.log(random_num)
    const bytes = window.crypto.getRandomValues(random_num)
    state.loginPin = bytes.join('').slice(0, 6)
  },
  setLoginPinTimeLeft(state, ms) {
    state.loginPinTimeLeft = ms
  },
  setLastDoc(state, doc) {
    state.wdsLastDoc = doc
  },
  setSnackBar(state, snackbar) {
    state.snackbar = snackbar
  },
  setMnemonic(state, mnemonic) {
    state.mnemonic = mnemonic
  },

  setIdentity(state, identityId) {
    state.identityId = identityId
  },
  setName(state, name) {
    state.name.label = name
    state.name.isRegistered = false
  },
  setNameRegistered(state, isRegistered) {
    state.name.isRegistered = isRegistered
  },
  setNameValid(state, isValid) {
    state.name.isValid = isValid
  },

  setNameDocId(state, docId) {
    state.name.docId = docId
  }
}
export const actions = {
  verifyAppRequest({ state }, appRequest) {
    const { loginPin } = state
    const senderPublicKey = 'Ag/YNnbAfG0IpNeH4pfMzgqIsgooR36s5MzzYJV76TpO' // TODO derive from dash identity

    const curIdentityPrivKey = client.account.getIdentityHDKey(0, 'user')
      .privateKey

    const plainUID_PIN = state.wdsVendorId.concat(
      state.name.docId,
      loginPin.toString()
    )
    const hashedAndEncryptedUID_PIN = appRequest.data.uid_pin

    const decryptedUID_PIN = DashmachineCrypto.decrypt(
      curIdentityPrivKey,
      hashedAndEncryptedUID_PIN,
      senderPublicKey
    ).data
    const verified = DashmachineCrypto.verify(plainUID_PIN, decryptedUID_PIN)
    console.log({ appRequest }, 'pin verified?', verified)

    return verified
  },
  async approveAppRequest({ state }, appDoc) {
    const { loginPin } = state
    const curIdentityPrivKey = client.account.getIdentityHDKey(0, 'user')
      .privateKey
    console.log('curIdentityPrivKey', curIdentityPrivKey.toString())

    const senderPublicKey = 'Ag/YNnbAfG0IpNeH4pfMzgqIsgooR36s5MzzYJV76TpO' // TODO derive from dash identity

    // reference: Vendor userID (Reference)
    // //CW decrypts the nonce
    const encryptedNonce = appDoc.data.nonce
    console.log('encryptedNonce', encryptedNonce)
    const decryptedNonce = DashmachineCrypto.decrypt(
      curIdentityPrivKey,
      encryptedNonce,
      senderPublicKey
    ).data
    console.log('decrypted nonce:', decryptedNonce)
    // vid_pin: Encrypted Hash of [Vendor nonce + Vendor userID + CW Pin)
    const plainVID_PIN = decryptedNonce.concat(
      state.wdsVendorId,
      loginPin.toString()
    )
    console.log('plainVID_PIN', plainVID_PIN)
    // hash then encrypt for the vendors PK
    const hashedVID_PIN = DashmachineCrypto.hash(plainVID_PIN).data
    console.log('hashedVID_PIN', hashedVID_PIN)
    const encryptedVID_PIN = DashmachineCrypto.encrypt(
      curIdentityPrivKey,
      hashedVID_PIN,
      senderPublicKey
    ).data
    console.log('encryptedVID_PIN', encryptedVID_PIN)

    // status: Encrypted [status+entropy] (0 = valid)
    const statusCode = 0
    const status = statusCode
      .toString()
      .concat(DashmachineCrypto.generateEntropy())
    console.log('status', status)
    const encryptedStatus = DashmachineCrypto.encrypt(
      curIdentityPrivKey,
      status,
      senderPublicKey
    ).data
    console.log('encryptedStatus', encryptedStatus)

    // LoginResponse DocData
    const loginResponseDocOpts = {
      reference: state.wdsVendorId,
      vid_pin: encryptedVID_PIN,
      status: encryptedStatus,
      temp_timestamp: appDoc.data.temp_timestamp
    }
    console.log('loginResponseDocOpts')
    console.dir(loginResponseDocOpts)

    const userIdentity = await client.platform.identities.get(state.identityId)
    const loginResponseDocument = await client.platform.documents.create(
      'wdsContract.TweetResponse',
      userIdentity,
      loginResponseDocOpts
    )
    console.log('loginReponse doc:')
    console.dir(loginResponseDocument)
    const documentBatch = {
      create: [loginResponseDocument],
      replace: [],
      delete: []
    }

    const submitStatus = await client.platform.documents.broadcast(
      documentBatch,
      userIdentity
    )
    console.log(submitStatus)
  },
  freshLoginPins({ commit, state }) {
    if (loginPinInterval) clearInterval(loginPinInterval)
    commit('setLoginPin')

    const refreshInterval = 300000
    loginPinInterval = setInterval(function() {
      if (state.loginPinTimeLeft < 1) {
        commit('setLoginPin')
        commit('setLoginPinTimeLeft', refreshInterval)
      } else {
        commit('setLoginPinTimeLeft', state.loginPinTimeLeft - 1000)
      }
    }, 1000)
  },
  showSnackbar({ commit }, { text, color = 'red' }) {
    commit('setSnackBar', { show: true, text, color, time: Date.now() })
  },
  async initWallet({ state, commit }) {
    commit('clearClientErrors')
    console.log('Initializing Dash.Client with mnemonic: ')
    console.log(state.mnemonic)

    client = new Dash.Client({
      seeds: [
        { service: 'seed-1.evonet.networks.dash.org' },
        { service: 'seed-2.evonet.networks.dash.org' },
        { service: 'seed-3.evonet.networks.dash.org' },
        { service: 'seed-4.evonet.networks.dash.org' },
        { service: 'seed-5.evonet.networks.dash.org' }
      ],
      mnemonic: state.mnemonic,
      apps: {
        wdsContract: { contractId: state.wdsContractId },
        dpns: {
          contractId: '7PBvxeGpj7SsWfvDSa31uqEMt58LAiJww7zNcVRP1uEM'
        }
      }
    })

    // Time isReady() since we can't catch timeout errors
    clientTimeoutIntervall = setInterval(() => {
      commit('setClientErrors', 'Connection to Evonet timed out.')
    }, 50000)
    const isReady = await client.isReady()
    clearInterval(clientTimeoutIntervall)

    console.log({ isReady })
    commit('setMnemonic', client.wallet.mnemonic)
    console.log({ client })

    const { account } = client

    console.log('init Funding address', account.getUnusedAddress().address)
    console.log('init Confirmed Balance', account.getConfirmedBalance())
    console.log('init Unconfirmed Balance', account.getUnconfirmedBalance())

    return client.isReady()
    // setInterval(function () {
    //     console.log(account.getTotalBalance())
    // }, 5000);
  },
  async getMagicInternetMoney() {
    console.log('Awaiting faucet drip..')
    const address = client.account.getUnusedAddress().address
    console.log('... for address: ' + address)
    try {
      const req = await this.$axios.get(
        `https://qetrgbsx30.execute-api.us-west-1.amazonaws.com/stage/?dashAddress=${address}`,
        { crossdomain: true }
      )
      // const req = await this.$axios.get(`http://localhost:5000/evodrip/us-central1/evofaucet/drip/${address}`)
      console.log('... faucet dropped.')
      console.log(req)
    } catch (e) {
      console.log(e)
      throw e
    }
  },
  async registerIdentity({ commit }) {
    console.log('Registering identity...')
    try {
      const identity = await client.platform.identities.register()
      commit('setIdentity', identity.id)
      console.log({ identity })
    } catch (e) {
      console.log('identity register error')
      console.log(e)
    }
  },
  registerIdentityOnceBalance({ dispatch }) {
    if (registerIdentityInterval) clearInterval(registerIdentityInterval)

    registerIdentityInterval = setInterval(function() {
      console.log('Waiting for positive balance to register identity..')
      console.log(client.account.getTotalBalance())
      console.log(client.account.getConfirmedBalance())
      console.log(client.account.getUnconfirmedBalance())
      if (client.account.getConfirmedBalance() > 0) {
        dispatch('registerIdentity')
        clearInterval(registerIdentityInterval)
      }
    }, 5000)
  },
  async registerNameOnceBalance({ state, dispatch }) {
    if (registerNameInterval) clearInterval(registerNameInterval)
    console.log('Awaiting client ..')
    const clientReady = await client.account.isReady()
    console.log('..client is ready.', clientReady)
    if (client.account.getConfirmedBalance() > 10000 && state.identityId) {
      dispatch('registerName')
    } else {
      registerNameInterval = setInterval(function() {
        console.log('Waiting for positive balance to register name..')
        console.log(client.account.getConfirmedBalance())
        if (client.account.getConfirmedBalance() > 10000 && state.identityId) {
          dispatch('registerName')
          clearInterval(registerNameInterval)
        }
      }, 5000)
    }
  },
  async registerName({ commit, dispatch }) {
    console.log('Registering Name with identityId: ')
    console.log(this.state.name.label)
    console.log(this.state.identityId)
    const identity = await client.platform.identities.get(this.state.identityId)
    console.log('Found valid identity:')
    console.log({ identity })

    console.log('Registering name')
    try {
      const createDocument = await client.platform.names.register(
        this.state.name.label,
        identity
      )
      console.log({ createDocument })
      const [doc] = await client.platform.documents.get('dpns.domain', {
        where: [
          ['normalizedParentDomainName', '==', 'dash'],
          ['normalizedLabel', '==', this.state.name.label.toLowerCase()]
        ]
      })
      console.log({ doc })
      commit('setNameRegistered', true)
      commit('setNameDocId', doc.id)
      window.$nuxt.$router.push('/actions')
    } catch (e) {
      dispatch('showSnackbar', {
        text: e.message + ' | Choose a new name.'
      })
      this.commit('setSyncing', false)
    }
  },
  async dashNameExists({ dispatch }, name) {
    const queryOpts = {
      where: [
        ['normalizedParentDomainName', '==', 'dash'],
        ['normalizedLabel', '==', name.toLowerCase()]
      ],
      startAt: 0,
      limit: 1,
      orderBy: [['normalizedLabel', 'asc']]
    }
    console.log('Checking if name exists on dpns..')
    try {
      const searchNames = await client.platform.documents.get(
        'dpns.domain',
        queryOpts
      )
      console.log({ searchNames })
      console.log(searchNames.length)
      if (searchNames.length === 1) {
        return true
      } else {
        return false
      }
    } catch (e) {
      dispatch('showSnackbar', { text: e.message })
      console.error('Something went wrong:', e)
    }
  },

  async queryDocuments(
    { dispatch },
    {
      appName,
      typeLocator,
      queryOpts = {
        limit: 1,
        startAt: 0,
        order: []
      }
    }
  ) {
    console.log('Querying documents...')
    console.log({ appName, typeLocator, queryOpts })
    // commit("setSyncing", true);
    try {
      await client.isReady()
      const documents = await client.platform.documents.get(
        `${appName}.${typeLocator}`,
        queryOpts
      )
      console.log({ documents })
      return documents
      // commit("setDocuments", { contractId, documents });
      // commit("setSyncing", false);
    } catch (e) {
      dispatch('showSnackbar', { text: e, color: 'red' })
      console.error('Something went wrong:', e)
      // commit("setSyncing", false);
    }
  },
  async getContract({ state }) {
    await client.isReady()
    const contract = await client.platform.contracts.get(state.wdsContractId)
    console.log({ contract })
    return contract
  }
}
