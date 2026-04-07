import React from 'react';
import { Household } from '~/types/api/household';
import { Objective } from '~/types/api/models';
import { Person } from '~/types/api/person';
import person1 from '../../../Reports/WhyReport/images/person1.png';
import person2 from '../../../Reports/WhyReport/images/person2.png';
import both from '../../../Reports/WhyReport/images/both.png';
import Modal from '~/ui/components/Dialogs/Modal';

interface IProps {
  isModalOpen: boolean;
  setIsOpen: any;
  household: Household;
  persons: Person[];
  objectives: Objective[];
}

const PriorityGridReportModal = ({ isModalOpen, setIsOpen, household, persons, objectives }: IProps) => {
  const metrics = ['Experience', 'Achievement', 'Impact', 'Legacy'];

  const objectivesToShow = objectives?.filter(obj => !obj.IsHidden);

  return (
    <Modal
      title={`Priority Grid Report`}
      isOpen={isModalOpen}
      handleClose={() => setIsOpen(false)}
      width="md"
      hideFooter={true}
    >
      <div className="prioritygrid-ppw-top">
        <div className="prioritygrid-body-copy">
          <div className="prioritygrid-intro">
            <p>
              <span style={{ fontWeight: '600' }} className="prioritygrid-blue">
                What does a well-lived life look like for you?
              </span>{' '}
              The priority grid report is a profile of your vision of success for yourself, your family, your
              enterprise, and your community in your pursuit of what matters most both today and in the years to come.
            </p>
          </div>
          <table className="prioritygrid-grid keep-together">
            <thead>
              <tr>
                <th></th>
                {household?.PrimaryPerson1ID ? (
                  <th>{persons?.find(p => p?.PersonID == household?.PrimaryPerson1ID)?.FirstName}</th>
                ) : null}
                {household?.PrimaryPerson2ID ? (
                  <th>{persons?.find(p => p?.PersonID == household?.PrimaryPerson2ID)?.FirstName}</th>
                ) : null}
                <th>Family</th>
                <th>Work-life</th>
                <th>Community</th>
              </tr>
            </thead>
            <tbody>
              {metrics?.map((metric, i) => {
                return (
                  <tr>
                    <td>{metric}</td>
                    <td>
                      {objectivesToShow?.map(o => {
                        if (
                          o?.PersonID == household?.PrimaryPerson1ID &&
                          o?.MetricOfSuccessID == i + 1 &&
                          o?.DimensionOfLifeID == 1
                        )
                          return (
                            <>
                              <p
                                className={
                                  o?.PersonID == household?.PrimaryPerson1ID
                                    ? 'prioritygrid-dark-turquoise'
                                    : o?.PersonID == household?.PrimaryPerson2ID
                                    ? 'prioritygrid-orange'
                                    : 'prioritygrid-blue'
                                }
                              >
                                {o?.Description}
                              </p>
                            </>
                          );
                      })}
                    </td>
                    <td>
                      {objectivesToShow?.map(o => {
                        if (
                          o?.PersonID == household?.PrimaryPerson2ID &&
                          o?.MetricOfSuccessID == i + 1 &&
                          o?.DimensionOfLifeID == 1
                        )
                          return (
                            <>
                              <p
                                className={
                                  o?.PersonID == household?.PrimaryPerson1ID
                                    ? 'prioritygrid-dark-turquoise'
                                    : o?.PersonID == household?.PrimaryPerson2ID
                                    ? 'prioritygrid-orange'
                                    : 'prioritygrid-blue'
                                }
                              >
                                {o?.Description}
                              </p>
                            </>
                          );
                      })}
                    </td>
                    <td>
                      {objectivesToShow?.map(o => {
                        if (o?.MetricOfSuccessID == i + 1 && o?.DimensionOfLifeID == 2)
                          return (
                            <>
                              <p
                                className={
                                  o?.PersonID == household?.PrimaryPerson1ID
                                    ? 'prioritygrid-dark-turquoise'
                                    : o?.PersonID == household?.PrimaryPerson2ID
                                    ? 'prioritygrid-orange'
                                    : 'prioritygrid-blue'
                                }
                              >
                                {o?.Description}
                              </p>
                            </>
                          );
                      })}
                    </td>
                    <td>
                      {objectivesToShow?.map(o => {
                        if (o?.MetricOfSuccessID == i + 1 && o?.DimensionOfLifeID == 3)
                          return (
                            <>
                              <p
                                className={
                                  o?.PersonID == household?.PrimaryPerson1ID
                                    ? 'prioritygrid-dark-turquoise'
                                    : o?.PersonID == household?.PrimaryPerson2ID
                                    ? 'prioritygrid-orange'
                                    : 'prioritygrid-blue'
                                }
                              >
                                {o?.Description}
                              </p>
                            </>
                          );
                      })}
                    </td>
                    <td>
                      {objectivesToShow?.map(o => {
                        if (o?.MetricOfSuccessID == i + 1 && o?.DimensionOfLifeID == 4)
                          return (
                            <>
                              <p
                                className={
                                  o?.PersonID == household?.PrimaryPerson1ID
                                    ? 'prioritygrid-dark-turquoise'
                                    : o?.PersonID == household?.PrimaryPerson2ID
                                    ? 'prioritygrid-orange'
                                    : 'prioritygrid-blue'
                                }
                              >
                                {o?.Description}
                              </p>
                            </>
                          );
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div>
            <div className="priority-grid-footer">
              <div className="prioritygrid-short-details">
                <div className="prioritygrid-f-col">
                  <div className="prioritygrid-f-row clearfix">
                    {household?.PrimaryPerson1ID ? (
                      <>
                        <img src={person1} />
                        <p>{persons?.find(p => p?.PersonID == household?.PrimaryPerson1ID)?.FirstName}</p>
                      </>
                    ) : null}

                    {household?.PrimaryPerson2ID ? (
                      <>
                        <img src={person2} />
                        <p>{persons?.find(p => p?.PersonID == household?.PrimaryPerson2ID)?.FirstName}</p>
                      </>
                    ) : null}

                    {household?.PrimaryPerson1ID && household?.PrimaryPerson2ID ? (
                      <>
                        <img src={both} />
                        <p>Both</p>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PriorityGridReportModal;
