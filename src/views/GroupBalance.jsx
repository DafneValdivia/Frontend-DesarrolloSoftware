import React, { useState, useEffect } from "react";
import '../App.css';
import './GroupBalance.css'
import RoundButton from "../components/RoundButton";
import Popup from "../components/PopUp";
import Navbar from '../components/Navbar';
import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';
import PropTypes from 'prop-types';
import { useParams, useLocation } from "react-router-dom";
import InviteMemberPopUp from "../components/InviteMemberPopUp";
import Select from "react-select";

const GroupBalance = () => {
    const { id: groupId } = useParams();  // Obtiene 'id' de la URL como 'groupId'
    const location = useLocation();
    const groupName = location.state?.groupName || "Nombre desconocido";

    const [transactions, setTransactions] = useState([]);
    const [deudas, setDeudas] = useState([]);
    const [balanceData, setBalanceData] = useState([]);
    const [membersData, setMembersData] = useState([]);
    const [paymentsData, setPaymentsData] = useState([]);
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

    const fetchData = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/transactions/group/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
                }
            }) // Ruta del back para obtener deudas segun el id del grupo
            console.log("Transacciones:", response.data);
            setTransactions(response.data);

            const response_debts = await axios.get(`${import.meta.env.VITE_SERVER_URL}/debts/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
                }
            })
            console.log("Deudas:", response_debts.data);
            setDeudas(response_debts.data);

            const response_balance = await axios.get(`${import.meta.env.VITE_SERVER_URL}/balance/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
                }
            })
            console.log("Balance:", response_balance.data);
            setBalanceData(response_balance.data);

            const response_payments = await axios.get(`${import.meta.env.VITE_SERVER_URL}/payments/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
                }
            })
            console.log("Pagos:", response_payments.data);
            setPaymentsData(response_payments.data);

            const response_members = await axios.get(`${import.meta.env.VITE_SERVER_URL}/groups/${groupId}/members`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
                }
            })
            console.log("Miembros:", response_members.data);

            const response_users = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
                }
            })
            console.log("Users:", response_users.data);

            // Asocia información de usuarios con los miembros
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
        console.log(membersData)

        } catch (error) {
            console.error("Error al obtener datos", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [isAuthenticated, user, groupId]);

    const getStateClass = (state) => {
        switch (state) {
            case "No pagada":
                return "estado-pendiente";
            case "Pagada":
                return "estado-pagado";
            case "Por confirmar":
                return "estado-en-proceso";
            case "Cancelada":
                return "estado-cancelada";
            default:
                return "";
        }
    };
    const [searchDeudor, setSearchDeudor] = useState(""); // Estado para buscar deudor
    const [searchPrestador, setSearchPrestador] = useState(""); // Estado para buscar prestador
    const [filter, setFilter] = useState("todos");
    // const filteredBalances = deudas.filter((deuda) => {
    //     const matchesFilter = filter === "todos" || deuda.state === filter;
    //     const matchesDeudor = searchDeudor === "" || deuda.debtor_name.username.toString().toLowerCase().includes(searchDeudor.toLowerCase());
    //     const matchesPrestador = searchPrestador === "" || deuda.creditor_name.username.toLowerCase().includes(searchPrestador.toLowerCase());
    //     return matchesFilter && matchesDeudor && matchesPrestador;
    // });
    // const sortedBalances = [...filteredBalances].sort((a, b) => a.deuda_id - b.deuda_id);

    const filteredBalances = balanceData.filter((deuda) => {
    //  const matchesFilter = filter === "todos" || deuda.state === filter;
        const matchesDeudor = searchDeudor === "" || deuda.fromName.toString().toLowerCase().includes(searchDeudor.toLowerCase());
        const matchesPrestador = searchPrestador === "" || deuda.toName.toLowerCase().includes(searchPrestador.toLowerCase());
        return matchesDeudor && matchesPrestador;
    });
    const sortedBalances = [...filteredBalances].sort((a, b) => a.deuda_id - b.deuda_id);

    const [popUp, setPopUp] = useState(null);
    const [option, setOption] = useState("balance");

    const handlePopUpClose = () => {
        setPopUp(null);  // Cierra el popup
        fetchData();  // Recarga los datos
    };

    const handleStateChange = async (debt, newState) => {
        try {
            const token = await getAccessTokenSilently();
            await axios.put(`${import.meta.env.VITE_SERVER_URL}/debts/${debt.debt_id}`, {
                state: newState,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
                }
            });
            console.log("enviado");
            fetchData(); // Recarga los datos después de actualizar
        } catch (error) {
            console.error("Error al actualizar el estado:", error);
        }
    };

    // Lógica add member
    const [showAddMemberPopup, setShowAddMemberPopup] = useState(false); // Controla la visibilidad del popup
    const [userContacts, setUserContacts] = useState([]); // Lista de contactos del usuario
    const [invitedUserMail, setInvitedUserMail] = useState(""); // Correo del usuario a invitar
    const [searchTerm, setSearchTerm] = useState(""); // Texto para filtrar contactos


    // Función para abrir el popup y cargar contactos del usuario
    const openAddMemberPopup = async () => {
        setShowAddMemberPopup(true);
        try {
            const token = await getAccessTokenSilently();
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/contacts/user/${user.email}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
                }
            });
            setUserContacts(response.data); // Guarda los contactos
        } catch (error) {
            console.error("Error al obtener contactos del usuario:", error);
        }
    };

    // Función para cerrar el popup
    const closeAddMemberPopup = () => {
        setShowAddMemberPopup(false);
        setInvitedUserMail(""); // Limpia el correo seleccionado
    };

    // Función para enviar la invitación
    const sendInvitation = async () => {
        try {
            const token = await getAccessTokenSilently();
            console.log("Enviando invitación a:", invitedUserMail);
            console.log("ID del grupo:", groupId);
            await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/groups/invitation`,
                {
                    invitedUserMail,
                    groupId,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
                    }
                }
            );
            console.log("Invitación enviada correctamente");
            closeAddMemberPopup(); // Cierra el popup
        } catch (error) {
            console.error("Error al enviar la invitación:", error);
        }
    };


    

    return (
        <div>
            <Navbar />
            <div >
               <h1 className="title_group">{groupName}</h1> 
            </div>
            
            <div className='filters'>
                {/* <button className={`button_header ${option === 'deudas' ? 'activeButton' : ''}`} onClick={() => setOption('deudas')}>deudas</button> */}
                <button className={`button_header ${option === 'balance' ? 'activeButton' : ''}`} onClick={() => setOption('balance')}>Balance Grupal</button>
                <button className={`button_header ${option === 'historial' ? 'activeButton' : ''}`} onClick={() => setOption('historial')}>Historial de Gastos ingresados</button>
                <button className={`button_header ${option === 'pagos' ? 'activeButton' : ''}`} onClick={() => setOption('pagos')}>Historial de Pagos realizados</button>
                <button className={`button_header ${option === 'detalles' ? 'activeButton' : ''}`} onClick={() => setOption('detalles')}>Detalles del Grupo</button>
            
            </div>

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

            {/* {option === "deudas" && (
                <div>

                    <table>
                        <thead>
                            <tr>
                                <th>Estado</th>
                                <th>Deudor</th>
                                <th>Prestador</th>
                                <th>Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deudas.map((deuda) => (
                                <tr key={deuda.id}>
                                    <td className={getStateClass(deuda.state)}>
                                        {deuda.debtor_name?.mail === user?.email || deuda.creditor_name?.mail === user?.email ? (
                                        <select className="dropdown_state"
                                            value={deuda.id}
                                            onChange={(e) => handleStateChange(deuda, e.target.value)}
                                            disabled={
                                                (user?.email === deuda.debtor_name?.mail && deuda.state !== "No pagada") ||
                                                (user?.email === deuda.creditor_name?.mail && !["No pagada", "Por confirmar"].includes(deuda.state))
                                            }
                                        >
                                            {user?.email === deuda.debtor_name?.mail && (
                                                <>
                                                    <option value={deuda.state}>{deuda.state}</option>
                                                    <option value="No pagada">No pagada</option>
                                                    <option value="Por confirmar">Por confirmar</option>
                                                </>
                                            )}
                                            {user?.email === deuda.creditor_name?.mail && (
                                                <>
                                                    <option value={deuda.state}>{deuda.state}</option>
                                                    <option value="No pagada">No pagada</option>
                                                    <option value="Por confirmar">Por confirmar</option>
                                                    <option value="Pagada">Pagada</option>
                                                    <option value="Cancelada">Cancelada</option>
                                                </>
                                            )}
                                        </select>
                                    ) : (
                                        <span>{deuda.state}</span>
                                    )}
                                    </td>
                                    <td>{deuda.debtor_name?.username || "Desconocido"}</td> 
                                    <td>{deuda.creditor_name?.username || "Desconocido"}</td>  
                                    <td>{deuda.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                </div>)} */}


            {option === "balance" && (
            <div>
                <div className="filters">
                    <div className="filter">
                        <label className='label_filter'>Filtrar por estado:</label>
                        <select
                            id="filter"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)} // Actualizar el filtro al cambiar
                        >
                            <option value="todos">Todos</option>
                            <option value="Pagada">Pagada</option>
                            <option value="Por confirmar">Por confirmar</option>
                            <option value="No pagada">No pagada</option>
                            <option value="Cancelada">Cancelada</option>
                        </select>
                    </div>


                        <div className="filter">
                            <label className='label_filter'>Buscar Deudor:</label>
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
                                <th>Estado</th>
                                <th>Deudor</th>
                                <th>Monto</th>
                                <th>Prestador</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedBalances.map((deuda) => (
                                <tr key={deuda.id}>
                                    <td className={getStateClass(deuda.state)}>
                                        {deuda.debtor_name?.mail === user?.email || deuda.creditor_name?.mail === user?.email ? (
                                        <select className="dropdown_state"
                                            value={deuda.id}
                                            onChange={(e) => handleStateChange(deuda, e.target.value)}
                                            disabled={
                                                (user?.email === deuda.debtor_name?.mail && deuda.state !== "No pagada") ||
                                                (user?.email === deuda.creditor_name?.mail && !["No pagada", "Por confirmar"].includes(deuda.state))
                                            }
                                        >
                                            {user?.email === deuda.debtor_name?.mail && (
                                                <>
                                                    <option value={deuda.state}>{deuda.state}</option>
                                                    <option value="No pagada">No pagada</option>
                                                    <option value="Por confirmar">Por confirmar</option>
                                                </>
                                            )}
                                            {user?.email === deuda.creditor_name?.mail && (
                                                <>
                                                    <option value={deuda.state}>{deuda.state}</option>
                                                    <option value="No pagada">No pagada</option>
                                                    <option value="Por confirmar">Por confirmar</option>
                                                    <option value="Pagada">Pagada</option>
                                                    <option value="Cancelada">Cancelada</option>
                                                </>
                                            )}
                                        </select>
                                    ) : (
                                        <span>{deuda.state}</span>
                                    )}
                                    </td>
                                    <td>{deuda.fromName || "Desconocido"}</td>  {/* Asegúrate de que deudor_name existe */}
                                    <td>{deuda.amount}</td>
                                    <td>{deuda.toName || "Desconocido"}</td>  {/* Asegúrate de que creditor_name existe */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <RoundButton
                        onClick={(e) => setPopUp("on")}
                        altText="Agregar deuda" // Texto alternativo
                    />
                </div>)}

            {option === "pagos" && (
                <div> 
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre de usuario</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                            </tr>
                        </thead>
                        <tbody>
                            {membersData.map((member) => (
                                <tr key={member.id}>
                                    <td>{member.username}</td>
                                    <td>{member.mail}</td>
                                    <td>{member.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            {option === "detalles" && (
                <div> 
                    <div className="left_side">
                        <h2>Miembros del Grupo</h2>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre de usuario</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                            </tr>
                        </thead>
                        <tbody>
                            {membersData.map((member) => (
                                <tr key={member.id}>
                                    <td>{member.username}</td>
                                    <td>{member.mail}</td>
                                    <td>{member.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="add-member-button-container">
                        <button id="btn-add-member" onClick={openAddMemberPopup}>Añadir miembro</button>
                    </div>
                    {showAddMemberPopup && (
                        <InviteMemberPopUp
                            userContacts={userContacts}
                            membersData={membersData}
                            invitedUserMail={invitedUserMail}
                            setInvitedUserMail={setInvitedUserMail}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            sendInvitation={sendInvitation}
                            closeAddMemberPopup={closeAddMemberPopup}
                        />
                    )}
                </div>
            )}

            {popUp && <Popup groupId={groupId} onClose={handlePopUpClose} />}

        </div>)
}

GroupBalance.propTypes = {
    groupId: PropTypes.string.isRequired
};

export default GroupBalance;