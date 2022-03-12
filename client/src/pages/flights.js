import React from 'react'
import {Container, Table} from "react-bootstrap";

const Flights = () => {
    return (
        <Container>
            <h1 className="mt-4">Тарифы</h1>
            <Table className="mt-4">
                <thead>
                <tr>
                    <th>Номер рейса</th>
                    <th>Город вылета</th>
                    <th>Город назначения</th>
                    <th>Аэропорт вылета</th>
                    <th>Аэропорт назначения</th>
                    <th>Дата вылета</th>
                    <th>Количество мест</th>
                </tr>
                </thead>
                <tbody>
                {
                    tariff.tariffs.map((tariff, index) => {
                            return (
                                <tr key={tariff.name}>
                                    <td>{index + 1}</td>
                                    <td>{tariff.name}</td>
                                    <td>{tariff.subscription_fee}</td>
                                    <td>{tariff.internet_traffic === '-1.00' ? 'Безлимит' : tariff.internet_traffic}</td>
                                    <td>{tariff.minutes === -1 ? 'Безлимит' : tariff.minutes}</td>
                                    <td>{tariff.sms === -1 ? 'Безлимит' : tariff.sms}</td>
                                </tr>
                            )
                        }
                    )
                }
                </tbody>
            </Table>
        </Container>
    )
}

export default Flights
