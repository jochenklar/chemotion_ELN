/* eslint-disable react/forbid-prop-types */
import { AgGridReact } from 'ag-grid-react';
import PropTypes from 'prop-types';
import React from 'react';
import GenericSubField from '../models/GenericSubField';
import { AddRowBtn, DelRowBtn } from './GridBtn';
import TypeSelect from './TypeSelect';
import SystemDefinedRenderer from './SystemDefinedRenderer';

export default class TableDef extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unitConfig: props.unitsFields.map(e => ({ value: e.field, name: e.label, label: e.label }))
    };
    this.autoSizeAll = this.autoSizeAll.bind(this);
    this.onGridReady = this.onGridReady.bind(this);
    this.delRow = this.delRow.bind(this);
    this.addRow = this.addRow.bind(this);
    this.selType = this.selType.bind(this);
    this.selDefined = this.selDefined.bind(this);
    this.refresh = this.refresh.bind(this);
    this.onCellValueChanged = this.onCellValueChanged.bind(this);
    this.columnDefs = [
      {
        headerName: 'Id',
        field: 'id',
        editable: false,
        minWidth: 50,
        width: 50,
      },
      {
        headerName: 'Column Heading',
        field: 'col_name',
        editable: true,
        minWidth: 150,
        width: 150,
        onCellValueChanged: this.onCellValueChanged
      },
      {
        headerName: 'Column Type',
        field: 'type',
        editable: false,
        minWidth: 150,
        width: 150,
        cellRendererFramework: TypeSelect,
        cellRendererParams: { all: ['text', 'system-defined'].map(e => ({ key: e, val: e, lab: e })), selType: this.selType },
      },
      {
        headerName: 'Default Value',
        field: 'value',
        editable: (e) => { if (e.data.type === 'system-defined') return false; return true; },
        minWidth: 250,
        cellRenderer: 'systemDefinedRenderer',
        cellRendererParams: { unitConfig: this.state.unitConfig, selDefined: this.selDefined },
        onCellValueChanged: this.onCellValueChanged
      },
      {
        headerName: 'Option Layers(hidden)',
        field: 'option_layers',
        width: 10,
        hide: true,
      },
      {
        headerName: 'Value System(hidden)',
        field: 'value_system',
        width: 10,
        hide: true,
      },
      {
        headerName: '',
        colId: 'actions',
        headerComponentFramework: AddRowBtn,
        headerComponentParams: { addRow: this.addRow },
        cellRendererFramework: DelRowBtn,
        cellRendererParams: { delRow: this.delRow },
        editable: false,
        filter: false,
        minWidth: 48,
        width: 48,
        suppressSizeToFit: true,
        pinned: 'left'
      },
    ];
    this.frameworkComponents = {
      systemDefinedRenderer: SystemDefinedRenderer
    };
  }

  componentDidUpdate() {
    this.autoSizeAll();
  }

  onGridReady(e) {
    this.gridApi = e.api;
    this.autoSizeAll();
  }

  onCellValueChanged(params) {
    const { oldValue, newValue } = params;
    if (oldValue === newValue) return;
    this.refresh();
  }

  autoSizeAll() {
    if (!this.gridApi) return;
    setTimeout(() => { this.gridApi.sizeColumnsToFit(); }, 10);
  }

  delRow() {
    const selectedData = this.gridApi.getSelectedRows();
    this.gridApi.applyTransaction({ remove: selectedData });
    this.refresh();
  }

  addRow() {
    const newSub = new GenericSubField({ col_name: '', type: 'text', value: '' });
    const idx = this.gridApi.getDisplayedRowCount();
    this.gridApi.applyTransaction({ add: [newSub], addIndex: idx });
    this.refresh();
  }

  selType(e, node) {
    const { data } = node;
    if (e.target.value === data.type) { return; }
    data.type = e.target.value;
    data.value = '';
    const { unitConfig } = this.state;
    if (data.type === 'system-defined') {
      data.option_layers = (unitConfig || [])[0].value;
      data.value_system = ((this.props.unitsFields.find(u => u.field === data.option_layers) || {})
        .units || [])[0].key;
    } else {
      delete data.option_layers;
      delete data.value_system;
    }
    const { updSub, layerKey, field } = this.props;
    const rows = [];
    this.gridApi.forEachNode((nd) => { rows.push(nd.data); });
    field.sub_fields = rows;
    this.gridApi.setRowData(rows);
    updSub(layerKey, field, () => {});
  }

  selDefined(e, node) {
    const { data } = node;
    if (e.target.value === data.option_layers) { return; }
    data.option_layers = e.target.value;
    data.value_system = ((this.props.unitsFields.find(u => u.field === data.option_layers) || {})
      .units || [])[0].key;
    this.refresh();
  }

  refresh() {
    const { updSub, layerKey, field } = this.props;
    const rows = [];
    this.gridApi.forEachNode((nd) => { rows.push(nd.data); });
    field.sub_fields = rows;
    updSub(layerKey, field, () => {});
  }

  render() {
    const { field } = this.props;
    const sub = field.sub_fields || [];
    return (
      <div>
        <div style={{ fontSize: '10px' }}>
          <b>Table: </b>
          define a table with the column type as label(display only), text or system-defined;<br />
          note: &#39;System-Defined&#39; represents the Unit field which
          has one input field and one unit converter.
        </div>
        <div style={{ width: '100%', height: '100%' }} className="ag-theme-balham">
          <AgGridReact
            enableColResize
            columnDefs={this.columnDefs}
            rowSelection="single"
            onGridReady={this.onGridReady}
            rowData={sub}
            singleClickEdit
            stopEditingWhenGridLosesFocus
            frameworkComponents={this.frameworkComponents}
            domLayout="autoHeight"
          />
        </div>
      </div>
    );
  }
}

TableDef.propTypes = {
  layerKey: PropTypes.string.isRequired,
  field: PropTypes.object.isRequired,
  updSub: PropTypes.func.isRequired,
  unitsFields: PropTypes.arrayOf(PropTypes.object).isRequired,
};
