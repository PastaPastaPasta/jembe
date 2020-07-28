import Dash from 'dash'
import Vue from 'vue'
import { encrypt } from 'dashmachine-crypto'
const $dappName = 'Jembe'
const $dappIcon = ''

// Helper Function
// TODO move to helper module
const timestamp = () => Math.floor(Date.now() / 1000)

//
// Cache identity lookups to speed up UX by avoiding to hit dapi multiple times
//

const IdentitiesCache = {}

// eslint-disable-next-line no-unused-vars
const cachedOrGetIdentity = async (client, identityId) => {
  console.log(
    'Checking IdentitiesCache for known identities using IdentityId',
    identityId
  )
  let identity
  if (identityId in IdentitiesCache) {
    identity = IdentitiesCache[identityId]
    console.log('Found existing cached identity', identity)
  } else {
    identity = await client.platform.identities.get(identityId)
    IdentitiesCache[identity.id] = identity
    console.log('Fetched unknown identity', identity)
  }
  console.log({ IdentitiesCache })
  return identity
}

//
//

let client
let clientTimeout
let registerIdentityInterval

// mnemonic: "come sight trade detect travel hazard suit rescue special clip choose crouch"
const getInitState = () => {
  console.log('getinitstate')
  return {
    fundingAddress: '',
    // mnemonic:
    //   'laugh document air fire humble vessel language push blush wrist cancel safe',
    mnemonic: null,
    // identityId: 'BUvY3Lxd7giT7jJgmJpkpnPGdUmh78u26woydmF82oKn',
    identityId: null,
    tmpPrivKey: '',
    delegatedCredential: {},
    accounts: [],
    name: {
      label: '',
      isValid: false,
      userId: '',
      uidPin: '',
      identityId: '',
      identity: {},
      userPubKey: '',
    }, // TODO replace with accounts, name -> user
    onboardText: 'Sign Up',
    onboardType: 'signup',
    jams: [],
    follows: {},
    isClientError: false,
    isSyncing: false,
  }
}
export const state = () => getInitState()

export const getters = {
  getJams(state) {
    return state.jams
  },
  getFollows(state) {
    return state.follows
  },
}
export const mutations = {
  setState(state, newState) {
    console.log('setstate')
    this.replaceState(newState)
  },
  setFundingAddress(state, address) {
    console.log('setting funding address', address)
    state.fundingAddress = address
  },
  setIdentity(state, identityId) {
    state.identityId = identityId
  },
  setTmpPrivKey(state, tmpPrivKey) {
    state.tmpPrivKey = tmpPrivKey
  },
  setUserPubKey(state, userPubKey) {
    state.userPubKey = userPubKey
  },
  setDelegatedCredentials(state, { delegatedCredential }) {
    console.log('commiting: :>> ', { delegatedCredential })
    state.delegatedCredential = delegatedCredential
  },
  setILiked(state, { like }) {
    const { jamId, timestamp, isLiked } = like
    const idx = state.jams.findIndex((jam) => jam.$id === jamId)
    state.jams[idx].iLiked.isLiked = isLiked
    state.jams[idx].iLiked.timestamp = timestamp
  },
  setFollowing(state, { jammerId, isFollowing }) {
    Vue.set(state.follows, jammerId, isFollowing)
  },
  setJams(state, jams) {
    state.jams = jams
  },
  setLikes(state, { jamId, likes }) {
    console.log('state.jams :>> ', state.jams)
    const idx = state.jams.findIndex((jam) => {
      return jam.$id === jamId
    })
    console.log('state.jams[idx] :>> ', state.jams[idx])
    state.jams[idx].likes = likes
  },
  setOnboardText(state, text) {
    state.onboardText = text
  },
  setOnboardType(state, type) {
    state.onboardType = type
  },
  setNameValid(state, isValid) {
    state.name.isValid = isValid
  },
  setName(state, name) {
    state.name.label = name
  },
  setUidPin(state, uidPin) {
    state.name.uidPin = uidPin
  },
  setUserId(state, userId) {
    state.name.userId = userId
  },
  setUserIdentityId(state, identityId) {
    state.name.identityId = identityId
  },
  setSnackBar(state, snackbar) {
    state.snackbar = snackbar
  },
  clearClientErrors(state) {
    state.clientErrorMsg = ''
    state.isClientError = false
    state.isSyncing = false
  },
}
export const actions = {
  async encryptRequestPin({ state }) {
    const { uidPin, tmpPrivKey, identityId } = state.name

    const userIdentity = await cachedOrGetIdentity(client, identityId)
    const userPubKey = userIdentity.publicKeys[0].data

    return encrypt(tmpPrivKey, uidPin, userPubKey)
  },
  async onboard({ state, getters, dispatch }) {
    switch (state.onboardType) {
      case 'signup':
        await dispatch('signupRequest', {})
        break
      case 'login':
        await dispatch('delegatedCredentialsRequest', {})
        break

      default:
        break
    }
  },
  // eslint-disable-next-line no-unused-vars
  setILikedIfRecent({ commit, state }, { like }) {
    const { jamId, timestamp } = like
    const idx = state.jams.findIndex((jam) => {
      return jam.$id === jamId
    })

    console.log('state.jams :>> ', state.jams)
    console.log('idx :>> ', idx)
    console.log('state.jams[idx] :>> ', state.jams[idx])
    const iLikedBefore = state.jams[idx].iLiked
    if (timestamp > iLikedBefore.timestamp) {
      commit('setILiked', { like })
    }
  },
  // eslint-disable-next-line no-unused-vars
  async sendJam({ dispatch, state }, jamText) {
    console.log('jamText :>> ', jamText)
    const doc = {
      text: jamText,
      userId: state.name.userId,
      timestamp: Math.floor(Date.now() / 1000),
    }
    await dispatch('submitDocument', { type: 'jams', doc })
  },
  async likeJam({ dispatch, state }, { jamId, isLiked = true }) {
    const like = {
      jamId,
      isLiked,
      userId: state.name.userId,
      timestamp: Math.floor(Date.now() / 1000),
    }
    console.log(JSON.stringify(like))
    await dispatch('submitDocument', { type: 'likes', doc: like })
  },
  async followJammer(
    { dispatch, state, commit },
    { jammerId, isFollowing = true }
  ) {
    const follow = {
      jammerId,
      isFollowing,
      userId: state.name.userId,
      timestamp: Math.floor(Date.now() / 1000),
    }
    console.log(JSON.stringify(follow))
    await dispatch('submitDocument', { type: 'follows', doc: follow })
    await commit('setFollowing', { jammerId, isFollowing })
  },
  // eslint-disable-next-line no-unused-vars
  async sendDash({ dispatch, state }, { amount }) {
    const encUidPin = await dispatch('encryptRequestPin')

    const tip = {
      uidPin: encUidPin,
      dappName: $dappName,
      satoshis: parseInt(amount).toString(), // MUST DO use dashcore to btc -> satoshis, FUTURE will be integer
      toAddress: 'yUADixXnWbrUD9PxUXFYUMwkMZxZH4u3hZ', // MUST DO resolve jamId -> jammerId -> identity -> publickey -> address
      contractId: client.apps.jembe.contractId,
      accountDocId: state.name.userId, // FUTURE Userid
      unixTimestamp: timestamp(),
    }
    await dispatch('submitDocument', {
      contract: 'primitives',
      type: 'PaymentRequest',
      doc: tip,
    })
  },
  async signupRequest({ dispatch, state }, { isRegistered = true }) {
    const payload = {
      Signup: {
        dappIcon: $dappIcon,
        dappName: $dappName,
        contractId: client.apps.jembe.contractId,
        accountDocId: state.name.userId,
        isRegistered,
        unixTimestamp: Math.floor(Date.now() / 1000),
      },
    }
    await dispatch('documentActionRequest', {
      payload,
    })
  },
  async delegatedCredentialsRequest({ dispatch }) {
    const payload = {
      DelegatedCredentials: {
        delegateIdentityId: '$fill', // Filled by PW
        pubKey: '$fill', // Filled by PW
        encPvtKey: '$fill', // Filled by PW
        unixTimestampExpiration: 0, // Filled by PW
      },
    }
    // TODO should be it's own request type
    await dispatch('documentActionRequest', {
      payload,
    })
  },
  // eslint-disable-next-line no-unused-vars
  async documentActionRequest(
    { dispatch, state },
    { action = 'create', payload }
  ) {
    const encUidPin = await dispatch('encryptRequestPin')

    console.log(encUidPin.data)
    const doc = {
      action,
      uidPin: encUidPin.data,
      dappName: $dappName,
      contractId: client.apps.jembe.contractId,
      accountDocId: state.name.userId,
      JSONDocString: JSON.stringify(JSON.stringify(payload)).slice(1, -1),
      unixTimestamp: timestamp(),
    }
    // MUST DO check for valid json payload
    await dispatch('submitDocument', {
      contract: 'primitives',
      type: 'DocumentActionRequest',
      doc,
    })
  },
  // eslint-disable-next-line no-unused-vars
  async fetchJams({ dispatch, commit }, { orderBy = undefined }) {
    console.log('fetchJams()')
    console.log('orderBy :>> ', orderBy)
    const queryOpts = {
      startAt: 1,
      limit: 100,
      orderBy,
    }
    console.log('queryOpts :>> ', queryOpts)

    const result = await dispatch('queryDocuments', {
      dappName: 'jembe',
      typeLocator: 'jams',
      queryOpts,
    })
    const jams = result.map((jam) => {
      return {
        ...jam.toJSON(),
        likes: '?',
        iLiked: { isLiked: false, timestamp: 0 },
      }
    })

    commit('setJams', jams)
  },
  async refreshLikesInState({ dispatch, getters }) {
    const jams = getters.getJams
    await Promise.all(
      jams.map(async (jam) => {
        const jamId = jam.$id
        console.log('jamId :>> ', jamId)
        const likes = await dispatch('countLikes', { jamId })
        console.log('jamLikes :>> ', likes)
      })
    )
  },
  // eslint-disable-next-line no-unused-vars
  async countLikes({ dispatch, commit, state }, { jamId, likes = 0 }) {
    // Recursive, async fun !
    console.log('countLikes() on page')

    const limit = 100
    const startAt = likes + 1

    const queryOpts = {
      startAt,
      limit,
      orderBy: [['timestamp', 'desc']],
      where: [['jamId', '==', jamId]],
    }

    const result = await dispatch('queryDocuments', {
      dappName: 'jembe',
      typeLocator: 'likes',
      queryOpts,
    })

    // Find my own likes and save the isLike true|false state for most recent document
    result.forEach(async (like) => {
      like = like.toJSON()
      console.log('like.userId :>> ', like.userId)
      console.log('state.name.userId :>> ', state.name.userId)
      if (like.userId === state.name.userId) {
        await dispatch('setILikedIfRecent', { like })
      }
    })

    // Get the count (array.length) of the 'like' docs, sorted by timestamp
    console.log('result :>> ', result)
    const liked = result.filter((jam) => jam.toJSON().isLiked === true).length
    const notLiked = result.filter((jam) => jam.toJSON().isLiked === false)
      .length
    console.log('liked :>> ', liked)
    console.log('notLiked :>> ', notLiked)
    const totalLiked = liked - notLiked
    console.log('totalLiked :>> ', totalLiked)
    const length = totalLiked

    // Keeping recursive count
    likes = likes + length

    // This is the recursive function call
    // Keeping scrolling through the pages until we run out of docs
    if (length === limit) {
      likes = await dispatch('countLikes', {
        jamId,
        likes,
      })
    }

    // We're on page #, this many queries hit the DAPI
    const page = likes / length + 1
    console.log({ length, limit, page, likes })
    commit('setLikes', { jamId, likes })
    return likes
  },

  // eslint-disable-next-line no-unused-vars
  async isSignedUp({ dispatch }, { userId }) {
    console.log('isSignedUp()', { userId })
    const queryOpts = {
      startAt: 1,
      limit: 1,
      orderBy: [['unixTimestamp', 'desc']],
      where: [['accountDocId', '==', userId]],
    }
    const dappName = 'primitives'
    const typeLocator = 'Signup'

    const [result] = await dispatch('queryDocuments', {
      dappName,
      typeLocator,
      queryOpts,
    })

    console.log('result :>> ', result)

    let isSignedUp
    if (result) {
      isSignedUp = result.toJSON().isRegistered
    } else {
      isSignedUp = false
    }

    // commit('setSignups', signupsJSON)
    console.log({ isSignedUp })
    console.log('isSignedUp :>> ', isSignedUp)
    return isSignedUp
  },

  async getDelegatedCredential({ dispatch }, { userId }) {
    console.log('getDelegatedCredential()', { userId })
    const queryOpts = {
      startAt: 1,
      limit: 1,
      orderBy: [['unixTimestampExpiration', 'desc']],
      where: [['delegateIdentityId', '==', userId]],
    }

    const dappName = 'primitives'
    const typeLocator = 'DelegatedCredentials'

    const [result] = await dispatch('queryDocuments', {
      dappName,
      typeLocator,
      queryOpts,
    })

    console.log('result :>> ', result)
    // MUST DO decrypt privkey here

    // commit('setSignups', signupsJSON)
    console.log('delCred :>> ', result)
    return result ? result.toJSON() : result
  },

  // eslint-disable-next-line no-unused-vars
  async submitDocument(
    // eslint-disable-next-line no-unused-vars
    { commit, dispatch, state },
    { contract = 'jembe', type, doc }
  ) {
    console.log('submitting document')
    console.log({ doc })
    console.log('of type')
    console.log({ type })

    const { platform } = client

    try {
      const { identityId } = state
      console.log({ identityId })
      const identity = await platform.identities.get(identityId)
      // const identity = await cachedOrGetIdentity(client, identityId)

      console.log({ identity })

      // Create the note document
      const document = await platform.documents.create(
        `${contract}.${type}`,
        identity,
        doc
      )
      const documentBatch = {
        // TODO phaseb add delegatedSignatures document and broadcast as batch
        create: [document],
        replace: [],
        delete: [],
      }
      console.log('created document:', { document })
      // Sign and submit the document
      const result = await platform.documents.broadcast(documentBatch, identity)
      console.log('result :>> ', result)
      // commit('addDocument', { identity, document }) // FIXME next under contractId
    } catch (e) {
      dispatch('showSnackbar', { text: e.message })
      console.error('Something went wrong:', e)
    }
  },
  // getCurPubKey() {
  //   const curIdentityHDKey = client.account.getIdentityHDKey(0, 'user')
  //   console.log({ publicKeyString: curIdentityHDKey.publicKey.toString() })

  //   const publicKey = curIdentityHDKey.publicKey.toString()
  //   return publicKey
  // },
  async syncDelegatedCredentials({ dispatch, state, commit }) {
    const dappName = 'primitives'
    const typeLocator = 'DelegatedCredentials'
    const queryOpts = {
      limit: 1,
      startAt: 1,
      orderBy: [['unixTimestampExpiration', 'desc']],
      where: [
        ['delegateIdentityId', '==', state.identityId],
        ['unixTimestampExpiration', '>', timestamp()],
      ],
    } // TODO need to filter for contractId and userId as well, check for isValid

    const result = await dispatch('queryDocuments', {
      dappName,
      typeLocator,
      queryOpts,
    })
    console.log('result :>> ', result)
    const delegatedCredential = result ? result[0] : undefined
    console.log('delegatedCredential :>> ', delegatedCredential)
    commit('setDelegatedCredentials', { delegatedCredential })
  },
  async fetchSignups({ dispatch, commit, getters }) {
    console.log('fetchSignups()')
    const queryOpts = {
      startAt: 1,
      limit: 5, // TODO fix select DISTINCT problem and paginate dApps
      orderBy: [['unixTimestamp', 'desc']],
      where: [['accountDocId', '==', getters.curAccountDocId]],
    }
    const dappName = 'primitives'
    const typeLocator = 'Signup'

    const signups = await dispatch('queryDocuments', {
      dappName,
      typeLocator,
      queryOpts,
    })
    const signupsJSON = signups.map((signup) => {
      return signup.toJSON()
    })
    console.log({ signupsJSON })
    commit('setSignups', signupsJSON)
  },

  async initOrCreateAccount({ commit, dispatch, state }, { mnemonicPin }) {
    // Get client to isReady state (with existing mnemonic or creating a new one)
    // Check if we have a balance, if not, get a drip
    // If Getting a drip, wait via setInterval for balance
    // +if error or timeout, instruct for manual balance increase // TODO implement wait for balance timeout
    // Once we have a balance:
    // (check if we have an identity, if not)
    // create identity, commit identity
    // create name, set isRegistered = true // TODO implement recover identity and name from dpp
    // catch errors at each step and self heal // TODO tests
    try {
      console.log('initorcreate, dispatch init')
      await dispatch('initWallet', { mnemonicPin })
    } catch (e) {
      console.dir({ e }, { depth: 5 })
      let message = e.message

      // FIXME decryptMnemonic clearly needs better error handling
      if (message === 'Expect mnemonic to be provided') {
        message = 'You entered the wrong PIN / Password.'
      }
      commit('setClientErrors', 'Connecting to Evonet: ' + message)
    }
    console.log("I'm done awaiting client.isReady()....")

    const account = await client.wallet.getAccount()
    const confirmedBalance = account.getConfirmedBalance()
    console.log('Confirmed Balance: ' + confirmedBalance)
    if (confirmedBalance > 500000) {
      if (this.$store.state.identityId === null) {
        try {
          this.registerIdentity()
        } catch (e) {
          console.log('No success in registering an identity, trying again ...')
          dispatch('showSnackbar', {
            text: e.message,
          })
          this.registerIdentity()
        }
      } else {
        console.log('Found existing identityId')
        console.log(this.$store.state.identityId)
      }
    } else {
      try {
        await dispatch('getMagicInternetMoney')
        // console.log('not getting a drip, faucet is broken')
      } catch (e) {
        console.log('commit error?', e)
        this.$store.commit(
          'setClientErrors',
          e.message +
            ' | Faucet not responding, manually send some evoDash to ' +
            this.freshAddress
        )
      }

      // TODO need to check if identity belongs to mnemonic
      if (state.identityId === null) {
        dispatch('registerIdentityOnceBalance')
      } else {
        console.log('Found existing identityId')
        console.log(state.identityId)
      }
    }
  },
  resetStateKeepAccounts({ state, commit }) {
    console.log({ state })
    console.log(state.accounts)
    const { accounts } = state
    console.log({ accounts })
    const initState = getInitState()
    console.log({ initState })
    initState.accounts = accounts
    console.log({ initState })
    commit('setState', initState)
    console.log({ state })
  },
  clearSession({ dispatch }) {
    // TODO refactor intervalls in an object and iterate them in clearAllIntervals()
    // TODO wrap setInterval and setTimout in setIntervalIfLoggedIn to clear itself if global stat login var is false
    clearInterval(registerIdentityInterval)
    clearTimeout(clientTimeout)

    if (client) client.disconnect()
    dispatch('resetStateKeepAccounts')
    client = undefined // DANGER Uh oh, we're setting global vars
  },
  showSnackbar({ commit }, { text, color = 'red' }) {
    commit('setSnackBar', { show: true, text, color, time: Date.now() })
  },
  // eslint-disable-next-line no-unused-vars
  async initWallet({ state, commit, dispatch }) {
    commit('clearClientErrors')
    console.log('Initializing Dash.Client with mnemonic: ')
    console.log('Encrypted mnemonic:', state.mnemonic)
    client = new Dash.Client({
      wallet: { mnemonic: state.mnemonic },
      // mnemonic: await dispatch('decryptMnemonic', {
      //   encMnemonic: state.mnemonic,
      //   pin: mnemonicPin,
      // }),
      apps: {
        // dpns: {
        //   contractId: '7PBvxeGpj7SsWfvDSa31uqEMt58LAiJww7zNcVRP1uEM',
        // },
        users: { contractId: 'FKS7RQeK7zQuUAQZ1v5DWtU6q6DiyWNfBBjerigro3JH' },
        primitives: {
          contractId: '6HK7gjrt2L4gvKMkCcKm7BzFFPFTAVu6e9XraQNXPA3k',
        },
        jembe: { contractId: '5bLpxkjHNALUiT2uA6AzM3BNYRZf8kx1bzSrGe2N2eXK' },
      },
    })

    // Timeout isReady() since we can't catch timeout errors
    clientTimeout = setTimeout(() => {
      commit('setClientErrors', 'Connection to Evonet timed out.')
    }, 500000) // TODO DEPLOY set sane timeout

    client.account = await client.wallet.getAccount({ index: 0 })
    const tmpPrivKey = client.account
      .getIdentityHDKeyByIndex(0, 0)
      .privateKey.toString()

    commit('setTmpPrivKey', tmpPrivKey)

    clearInterval(clientTimeout)

    console.log({ client })

    console.log(
      'init Funding address',
      client.account.getUnusedAddress().address
    )
    console.log('init Confirmed Balance', client.account.getConfirmedBalance())
    console.log(
      'init Unconfirmed Balance',
      client.account.getUnconfirmedBalance()
    )
    commit('setFundingAddress', client.account.getUnusedAddress().address)
  },
  async getMagicInternetMoney() {
    console.log('Awaiting faucet drip..')
    const account = await client.wallet.getAccount()
    const address = account.getUnusedAddress().address
    console.log('... for address: ' + address)
    try {
      // const req = await this.$axios.get(
      //   `https://qetrgbsx30.execute-api.us-west-1.amazonaws.com/stage/?dashAddress=${address}`,
      //   { crossdomain: true }
      // )
      // const req = await this.$axios.get(`http://localhost:5000/evodrip/us-central1/evofaucet/drip/${address}`)
      const req = await this.$axios.get(
        `https://us-central1-evodrip.cloudfunctions.net/evofaucet/drip/${address}`
      )
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

    // eslint-disable-next-line no-unused-vars
    registerIdentityInterval = setInterval(async () => {
      const account = await client.wallet.getAccount()
      console.log('Waiting for positive balance to register identity..')
      console.log('init Funding address', account.getUnusedAddress().address)
      console.log(account.getTotalBalance())
      console.log(account.getConfirmedBalance())
      console.log(account.getUnconfirmedBalance())
      if (account.getConfirmedBalance() > 0) {
        dispatch('registerIdentity')
        clearInterval(registerIdentityInterval)
      }
    }, 5000)
  },
  async dashNameExists({ dispatch }, name) {
    try {
      const doc = await client.platform.names.resolve(name + '.dash')
      console.log(doc)
      return doc ? doc.toJSON() : doc
    } catch (e) {
      dispatch('showSnackbar', { text: e.message })
      console.error('Something went wrong:', e)
    }
  },
  async queryDocuments(
    // eslint-disable-next-line no-unused-vars
    { dispatch, commit },
    {
      dappName,
      typeLocator,
      queryOpts = {
        limit: 1,
        startAt: 1,
      },
    }
  ) {
    console.log('Querying documents...')
    console.log({ dappName, typeLocator, queryOpts })
    // commit('setSyncing', true)
    try {
      const documents = await client.platform.documents.get(
        `${dappName}.${typeLocator}`,
        queryOpts
      )
      console.log({ documents })
      return documents
    } catch (e) {
      dispatch('showSnackbar', { text: e, color: 'red' })
      console.error('Something went wrong:', e)
    } finally {
      // commit('setSyncing', false)
    }
  },
  async getContract({ state }) {
    const contract = await client.platform.contracts.get(state.wdsContractId)
    console.log({ contract })
    return contract
  },
}
