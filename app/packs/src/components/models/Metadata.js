import Element from './Element';

export default class Metadata extends Element {
  static buildEmpty(collection_id) {
    const metadata = new Metadata({
      collection_id,
      type: 'metadata',
      metadata: {}
    });

    return metadata;
  }

  add(field, index, subfield) {
    if (field == 'keywords') {
      this.addKeyword()
    } else if (field == 'subjects') {
      this.addSubject()
    } else if (field == 'creators') {
      if (subfield == 'affiliations') {
        this.addAffiliation('creators', index)
      } else {
        this.addCreator()
      }
    } else if (field == 'contributors') {
      if (subfield == 'affiliations') {
        this.addAffiliation('contributors', index)
      } else {
        this.addContributor()
      }
    } else if (field == 'alternateIdentifiers') {
      this.addAlternateIdentifier()
    } else if (field == 'relatedIdentifiers') {
      this.addRelatedIdentifier()
    } else if (field == 'rightsHolders') {
      this.addRightsHolder()
    } else if (field == 'rights') {
      this.addRights()
    } else if (field == 'fundingReferences') {
      this.addFundingReferences()
    }
  }

  addKeyword() {
    if (this.metadata.keywords === undefined) {
      this.metadata.keywords = []
    }

    this.metadata.keywords.push('')
  }

  addSubject() {
    if (this.metadata.subjects === undefined) {
      this.metadata.subjects = []
    }

    this.metadata.subjects.push('')
  }

  addCreator() {
    if (this.metadata.creators === undefined) {
      this.metadata.creators = []
    }

    this.metadata.creators.push({
      given_name: '',
      family_name: '',
      orcid: '',
      affiliations: [{
        affiliation: ''
      }]
    })
  }

  addContributor() {
    if (this.metadata.contributors === undefined) {
      this.metadata.contributors = []
    }

    this.metadata.contributors.push({
      given_name: '',
      family_name: '',
      orcid: '',
      affiliations: [{
        affiliation: ''
      }]
    })
  }

  addAffiliation(field, index) {
    if (this.metadata[field] === undefined) {
      this.metadata[field] = []
    }

    this.metadata[field][index].affiliations.push({
      affiliation: ''
    })
  }

  addAlternateIdentifier() {
    if (this.metadata.alternateIdentifiers === undefined) {
      this.metadata.alternateIdentifiers = []
    }

    this.metadata.alternateIdentifiers.push({
      alternateIdentifier: '',
      alternateIdentifierType: ''
    })
  }

  addRelatedIdentifier() {
    if (this.metadata.relatedIdentifiers === undefined) {
      this.metadata.relatedIdentifiers = []
    }

    this.metadata.relatedIdentifiers.push({
      relatedIdentifier: '',
      relatedIdentifierType: '',
      relationType: ''
    })
  }

  addRightsHolder() {
    if (this.metadata.rightsHolders === undefined) {
      this.metadata.rightsHolders = []
    }

    this.metadata.rightsHolders.push({
      rightsHolder: '',
    })
  }

  addRights() {
    if (this.metadata.rights === undefined) {
      this.metadata.rights = []
    }

    this.metadata.rights.push({
      controlledRights: '',
      additionalRights: ''
    })
  }

  addFundingReferences() {
    if (this.metadata.fundingReferences === undefined) {
      this.metadata.fundingReferences = []
    }

    this.metadata.fundingReferences.push({
      funderName: '',
      funderIdentifier: '',
      funderIdentifierType: '',
      awardNumber: '',
      awardURI: '',
      awardTitle: ''
    })
  }

  change(value, field, index, subfield, subindex, subsubfield) {
    if (subsubfield !== undefined) {
      // e.g. metadata.creators[0].affiliations[0].affiliaton
      if (this.metadata[field][index][subfield] === undefined) {
        this.metadata[field][index][subfield] = [{}]
      }
      this.metadata[field][index][subfield][subindex][subsubfield] = value
    } else if (subindex !== undefined) {
      // e.g. ?
      if (this.metadata[field][index][subfield] === undefined) {
        this.metadata[field][index][subfield] = []
      }
      this.metadata[field][index][subfield][subindex] = value
    } else if (subfield !== undefined) {
      // e.g. metadata.creators[0].givenName
      this.metadata[field][index][subfield] = value
    } else if (index !== undefined) {
      // e.g. metadata.keywords[0]
      this.metadata[field][index] = value
    } else if (field !== undefined) {
      // e.g. metadata.title
      this.metadata[field] = value
    }
  }

  remove(field, index, subfield, subindex) {
    if (subindex !== undefined) {
      // e.g. metadata.creators[0].affiliations[0]
      const values = [...this.metadata[field][index][subfield]]
      values.splice(subindex, 1)
      this.metadata[field][index][subfield] = values
    } else if (index !== undefined) {
      // e.g. metadata.keywords[0]
      const values = [...this.metadata[field]]
      values.splice(index, 1)
      this.metadata[field] = values
    }
  }

  serialize() {
    return {
      collection_id: this.collection_id,
      metadata: this.metadata
    }
  }

  title() {
    // for the details tab
    return 'Metadata'
  }
}
