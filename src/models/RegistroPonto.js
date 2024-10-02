import mongoose from 'mongoose'

const schema = new mongoose.Schema({ 
    nsr: { type: String, required: true }, 
    tipoRegistro: { type: String, required: true },
    dataHora: { type: Date, required: true },
    cpf: { Type: String },
    crc16: { Type: String } 
}, { timestamps: true });

const RegistroPonto = mongoose.model('RegistroPonto', schema);

export default RegistroPonto;
