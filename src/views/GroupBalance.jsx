import { useState, useEffect } from "react";
import '../App.css';
import './GroupBalance.css';
import RoundButton from "../components/RoundButton";
import Popup from "../components/PopUp";
import Navbar from '../components/Navbar';
import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';
import PropTypes from 'prop-types';
import { useParams, useLocation } from "react-router-dom";
import PopupPagos from "../components/PopUpPagos";
import InviteMemberPopUp from "../components/InviteMemberPopUp";
import { useNavigate } from "react-router-dom";

const GroupBalance = () => {
    const { id: groupId } = useParams(); // Obtiene 'id' de la URL como 'groupId'
    const location = useLocation();
    const groupName = location.state?.groupName || "Nombre desconocido";

    const [transactions, setTransactions] = useState([]);
    const [balanceData, setBalanceData] = useState([]);
    const [membersData, setMembersData] = useState([]);
    const [paymentsData, setPaymentsData] = useState([]);
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [searchDeudor, setSearchDeudor] = useState(""); // Estado para buscar deudor
    const [searchPrestador, setSearchPrestador] = useState(""); // Estado para buscar prestador
    const [popUp, setPopUp] = useState(null);
    const [popUpPagos, setPopUpPagos] = useState(null);
    const [option, setOption] = useState("balance");
    const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);
    const [userContacts, setUserContacts] = useState([]);
    const [invitedUserMail, setInvitedUserMail] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [feedbackMessage, setFeedbackMessage] = useState(null);
    const [isError, setIsError] = useState(false); // Estado para distinguir entre éxito o error
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const token = await getAccessTokenSilently();

            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/transactions/group/${groupId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTransactions(response.data);

            const response_balance = await axios.get(`${import.meta.env.VITE_SERVER_URL}/balance/${groupId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBalanceData(response_balance.data);

            const response_payments = await axios.get(`${import.meta.env.VITE_SERVER_URL}/payments/${groupId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPaymentsData(response_payments.data);

            const response_members = await axios.get(`${import.meta.env.VITE_SERVER_URL}/groups/${groupId}/members`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const response_users = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const enrichedMembers = response_members.data.map((member) => {
                const user = response_users.data.find((u) => u.id === member.user_id);
                return {
                    ...member,
                    username: user?.username || "Desconocido",
                    mail: user?.mail || "Sin correo",
                    phone: user?.phone || "Sin número de teléfono",
                };
            });

            setMembersData(enrichedMembers);
        } catch (error) {
            console.error("Error al obtener datos", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [isAuthenticated, user, groupId]);

    const filteredBalances = balanceData.filter((deuda) => {
        const matchesDeudor = searchDeudor === "" || deuda.fromName?.toLowerCase().includes(searchDeudor.toLowerCase());
        const matchesPrestador = searchPrestador === "" || deuda.toName?.toLowerCase().includes(searchPrestador.toLowerCase());
        return matchesDeudor && matchesPrestador;
    });

    const sortedBalances = [...filteredBalances].sort((a, b) => a.deuda_id - b.deuda_id);

    const handlePopUpClose = () => {
        setPopUp(null);
        fetchData();
    };

    const handlePopUpPagosClose = () => {
        setPopUpPagos(null);
        fetchData();
    };

    const openAddMemberPopup = async () => {
        setShowAddMemberPopup(true);
        try {
            const token = await getAccessTokenSilently();
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/contacts/user/${user.email}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserContacts(response.data);
        } catch (error) {
            console.error("Error al obtener contactos del usuario:", error);
        }
    };

    const closeAddMemberPopup = () => {
        setShowAddMemberPopup(false);
        setInvitedUserMail("");
    };

    const sendInvitation = async () => {
        try {
            const token = await getAccessTokenSilently();
            await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/groups/invitation`,
                { invitedUserMail, groupId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccessMessage(`Invitación enviada a ${invitedUserMail}`);
            closeAddMemberPopup();
            setTimeout(() => setSuccessMessage(""), 5000);
        } catch (error) {
            console.error("Error al enviar la invitación:", error);
        }
    };

    const handleDeleteMember = async (memberMail) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este miembro?")) return;

        try {
            const token = await getAccessTokenSilently();
            await axios.delete(`${import.meta.env.VITE_SERVER_URL}/groups/${groupId}/member/${memberMail}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFeedbackMessage(`El miembro con correo ${memberMail} fue eliminado exitosamente.`);
            setIsError(false);
            fetchData();
            setTimeout(() => setFeedbackMessage(null), 5000);
        } catch (error) {
            console.error("Error al eliminar miembro:", error);
            setFeedbackMessage("Ocurrió un problema al intentar eliminar el miembro.");
            setIsError(true);
            setTimeout(() => setFeedbackMessage(null), 5000);
        }
    };

    const handleLeaveGroup = async () => {
        if (!window.confirm("¿Estás seguro de que quieres salir del grupo?")) return;

        try {
            const token = await getAccessTokenSilently();
            await axios.delete(`${import.meta.env.VITE_SERVER_URL}/groups/${groupId}/member/${user.email}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFeedbackMessage("Has salido del grupo correctamente.");
            setIsError(false);
            setTimeout(() => navigate('/yourgroups'), 2000);
        } catch (error) {
            console.error("Error al salir del grupo:", error);
            setFeedbackMessage("Ocurrió un problema al intentar salir del grupo.");
            setIsError(true);
            setTimeout(() => setFeedbackMessage(null), 5000);
        }
    };

    return (
        <div>
            <Navbar />
            <h1 className="title_group">{groupName}</h1>

            <div className="filters">
                <button className={`button_header ${option === 'balance' ? 'activeButton' : ''}`} onClick={() => setOption('balance')}>Balance Grupal</button>
                <button className={`button_header ${option === 'historial' ? 'activeButton' : ''}`} onClick={() => setOption('historial')}>Historial de Gastos ingresados</button>
                <button className={`button_header ${option === 'pagos' ? 'activeButton' : ''}`} onClick={() => setOption('pagos')}>Historial de Pagos realizados</button>
                <button className={`button_header ${option === 'detalles' ? 'activeButton' : ''}`} onClick={() => setOption('detalles')}>Detalles del Grupo</button>
            </div>

            {option === "balance" && (
                <div>
                    <div className="filters">
                        <div className="filter">
                            <label className="label_filter">Buscar Deudor:</label>
                            <input
                                type="text"
                                placeholder="Ej. 1"
                                value={searchDeudor}
                                onChange={(e) => setSearchDeudor(e.target.value)}
                            />
                        </div>
                        <div className="filter">
                            <label className="label_filter">Buscar Prestador:</label>
                            <input
                                type="text"
                                placeholder="Ej. Persona A"
                                value={searchPrestador}
                                onChange={(e) => setSearchPrestador(e.target.value)}
                            />
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Deudor</th>
                                <th>Monto</th>
                                <th>Prestador</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedBalances.map((deuda) => (
                                <tr key={deuda.id}>
                                    <td>{deuda.fromName || "Desconocido"}</td>
                                    <td>{deuda.amount}</td>
                                    <td>{deuda.toName || "Desconocido"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <RoundButton onClick={() => setPopUp("on")} altText="Agregar deuda" />
                </div>
            )}

            {option === "historial" && (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaccion) => (
                                <tr key={transaccion.id}>
                                    <td>{transaccion.title}</td>
                                    <td>{transaccion.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {option === "pagos" && (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Deudor</th>
                                <th>Monto</th>
                                <th>Prestador</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentsData.map((payment) => {
                                const debtor = membersData.find(member => member.member_id === payment.debtor_id);
                                const creditor = membersData.find(member => member.member_id === payment.creditor_id);
                                return (
                                    <tr key={payment.id}>
                                        <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                                        <td>{debtor?.username || "Desconocido"}</td>
                                        <td>{payment.amount}</td>
                                        <td>{creditor?.username || "Desconocido"}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <RoundButton onClick={() => setPopUpPagos("on")} altText="Agregar pago" />
                </div>
            )}

            {option === "detalles" && (
                <div>
                    <h2>Miembros del Grupo</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre de usuario</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {membersData.map((member) => (
                                <tr key={member.id}>
                                    <td>{member.username}</td>
                                    <td>{member.mail}</td>
                                    <td>{member.phone}</td>
                                    <td>
                                        {member.mail === user.email ? (
                                            <button
                                                className="leave-button"
                                                onClick={handleLeaveGroup}
                                            >
                                                Salirme
                                            </button>
                                        ) : (
                                            <button
                                                className="delete-button"
                                                onClick={() => handleDeleteMember(member.mail)}
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div>
                        <button
                            onClick={openAddMemberPopup}
                            disabled={membersData.length >= 10}
                            title={membersData.length >= 10 ? "No puedes añadir más de 10 miembros" : ""}
                        >
                            Añadir miembro
                        </button>
                        {successMessage && <div>{successMessage}</div>}
                        {feedbackMessage && (
                            <div className={isError ? "error" : "success"}>
                                {feedbackMessage}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {popUp && <Popup groupId={groupId} onClose={handlePopUpClose} />}
            {popUpPagos && <PopupPagos groupId={groupId} onClose={handlePopUpPagosClose} balanceData={balanceData} />}
        </div>
    );
};

GroupBalance.propTypes = {
    groupId: PropTypes.string.isRequired
};

export default GroupBalance;
