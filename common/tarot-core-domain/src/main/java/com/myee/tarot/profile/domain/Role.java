package com.myee.tarot.profile.domain;

import com.myee.tarot.core.GenericEntity;

import javax.persistence.*;

/**
 * Created by Martin on 2016/4/14.
 */
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "C_ROLE")
public class Role extends GenericEntity<Long, Role> {
    @Id
    @Column(name = "ROLE_ID", unique = true, nullable = false)
    @TableGenerator(name = "TABLE_GEN", table = "C_SEQUENCER", pkColumnName = "SEQ_NAME", valueColumnName = "SEQ_COUNT", pkColumnValue = "ROLE_SEQ_NEXT_VAL")
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "TABLE_GEN")
    protected Long id;

    @Column(name = "ROLE_NAME", nullable = false)
    protected String roleName;

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;

        Role role = (Role) o;

        return !(roleName != null ? !roleName.equals(role.roleName) : role.roleName != null);

    }

    @Override
    public int hashCode() {
        int result = super.hashCode();
        result = 31 * result + (roleName != null ? roleName.hashCode() : 0);
        return result;
    }
}
